import React, { useMemo, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { initialTransactions, simulateTransaction } from './data/transactions';
import { analyzeTransaction, DEFAULT_RULES, formatMoney } from './lib/risk';
import { supabase, supabaseConfigured } from './lib/supabase';
import { loadWorkspace, addTransaction, updateReview, saveRules, resetWorkspace } from './lib/workspace';
import AuthScreen from './AuthScreen';
import { STORAGE, getStored, riskMeta } from './config/constants';
import { Sidebar, Header, Drawer, Simulator, Toast } from './components';
import { analyzeSimulatedTransaction } from './api/riskClient';
import { Overview } from './pages/Overview';
import { TransactionsPage } from './pages/Transactions';
import { AlertsPage } from './pages/Alerts';
import { AnalyticsPage } from './pages/Analytics';
import { RulesPage } from './pages/Rules';
import { SettingsPage } from './pages/Settings';

export default function App() {
  const [saved]=useState(getStored);
  const [transactions,setTransactions]=useState(()=>supabaseConfigured ? [] : (saved?.transactions||initialTransactions()));
  const [rules,setRules]=useState(()=>({...DEFAULT_RULES,...(supabaseConfigured ? {} : (saved?.rules||{}))}));
  const [user,setUser]=useState(null);
  const [authBusy,setAuthBusy]=useState(supabaseConfigured);
  const [workspaceReady,setWorkspaceReady]=useState(!supabaseConfigured);
  const [workspaceError,setWorkspaceError]=useState('');
  const [refreshKey,setRefreshKey]=useState(0);
  const [page,setPage]=useState('overview');
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('all');
  const [selectedId,setSelectedId]=useState(null);
  const [simOpen,setSimOpen]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [toast,setToast]=useState(null);
  // Keep standalone mode unchanged when no Supabase project is configured.
  useEffect(()=>{if(!supabaseConfigured)localStorage.setItem(STORAGE,JSON.stringify({transactions,rules}));},[transactions,rules]);
  useEffect(()=>{
    if (!supabase) return;
    let alive=true;
    supabase.auth.getSession().then(({data,error})=>{
      if (!alive) return;
      if (error) setWorkspaceError(error.message);
      setUser(data?.session?.user || null);setAuthBusy(false);
    }).catch(error=>{if(alive){setWorkspaceError(error.message);setAuthBusy(false)}});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(alive){setUser(session?.user || null);setAuthBusy(false)}
    });
    return ()=>{alive=false;subscription.unsubscribe()};
  },[]);
  useEffect(()=>{
    if(!supabaseConfigured || !user?.id){setWorkspaceReady(!supabaseConfigured);return;}
    let alive=true;
    setWorkspaceReady(false);setWorkspaceError('');
    loadWorkspace(user.id).then(data=>{
      if(alive){setTransactions(data.transactions);setRules(data.rules);setWorkspaceReady(true)}
    }).catch(error=>{if(alive){setWorkspaceError(error.message);setWorkspaceReady(false)}});
    return ()=>{alive=false};
  },[user?.id,refreshKey]);
  useEffect(()=>{
    if(!supabaseConfigured || !user?.id || !workspaceReady) return;
    const timer=setTimeout(()=>{saveRules(user.id,rules).catch(error=>{
      setToast({kind:'warning',title:'Could not save rules',detail:error.message});
    })},700);
    return ()=>clearTimeout(timer);
  },[rules,user?.id,workspaceReady]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),4800);return()=>clearTimeout(timer);},[toast]);
  useEffect(()=>{const handler=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPage('transactions');document.querySelector('.top-search input')?.focus()}if(e.key==='Escape'){setSelectedId(null);setSimOpen(false);setMobileOpen(false)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);
  const rows=useMemo(()=>transactions.map(t=>({...t,...analyzeTransaction(t,rules)})).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)),[transactions,rules]);
  const selected=rows.find(t=>t.id===selectedId);
  const stats=useMemo(()=>({total:rows.length,volume:rows.reduce((s,t)=>s+t.amount,0),high:rows.filter(t=>t.level==='high').length,medium:rows.filter(t=>t.level==='medium').length,low:rows.filter(t=>t.level==='low').length,flaggedValue:rows.filter(t=>t.level!=='low').reduce((s,t)=>s+t.amount,0)}),[rows]);
  const alertCount=rows.filter(t=>t.level!=='low'&&!t.reviewed).length;
  const review=async(id,result)=>{
    try{
      if(supabaseConfigured)await updateReview(user.id,id,result);
      setTransactions(prev=>prev.map(t=>t.id===id?{...t,reviewed:result}:t));setSelectedId(null);
      setToast({kind:'success',title:result?'Transaction reviewed':'Review removed',detail:'Your review has been saved.'});
    }catch(error){setToast({kind:'warning',title:'Could not save review',detail:error.message})}
  };
  const run=async(scenario)=>{
    try{
      let tx=simulateTransaction(scenario);
      if(supabaseConfigured)tx=await addTransaction(user.id,tx);
      setTransactions(prev=>[tx,...prev]);setSelectedId(tx.id);
      const risk=await analyzeSimulatedTransaction(tx,rules);
      setToast({kind:risk.level==='low'?'success':'warning',title:'Transaction analyzed',detail:`${formatMoney(tx.amount)} · Risk score ${risk.score}/100 · ${riskMeta[risk.level].label}`});
    }catch(error){setToast({kind:'warning',title:'Could not save transaction',detail:error.message})}
  };
  const exportCsv=()=>{const header=['ID','Merchant','Category','Amount INR','Location','Date','Risk score','Risk level','Review'];const quote=(s)=>'"'+String(s).replaceAll('"','""')+'"';const csv=[header,...rows.map(t=>[t.id,t.merchant,t.category,t.amount,t.location,t.timestamp,t.score,t.level,t.reviewed||'unreviewed'])].map(row=>row.map(quote).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='fraudshield-demo-transactions.csv';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(link.href);setToast({kind:'success',title:'Export downloaded',detail:`Exported ${rows.length} synthetic records as CSV.`})};
  const reset=async()=>{
    try{
      const data=supabaseConfigured ? await resetWorkspace(user.id) : initialTransactions();
      setTransactions(data);setRules(DEFAULT_RULES);setSelectedId(null);
      setToast({kind:'success',title:'Demo restored',detail:'Synthetic transactions and detection rules have been reset.'});
    }catch(error){setToast({kind:'warning',title:'Could not reset workspace',detail:error.message})}
  };
  if(supabaseConfigured && (authBusy || (user && !workspaceReady && !workspaceError))){
    return <div className="auth-page"><div className="auth-card"><div className="auth-logo"><ShieldCheck size={26}/></div><h1>Loading secure workspace...</h1><p>Connecting to your private demo data.</p></div></div>;
  }
  if(supabaseConfigured && !user) return <AuthScreen/>;
  if(supabaseConfigured && workspaceError) return <div className="auth-page"><div className="auth-card"><h1>Workspace unavailable</h1><p>{workspaceError}</p><button className="button primary auth-submit" onClick={()=>setRefreshKey(key=>key+1)}>Retry connection</button><button className="button subtle auth-submit" onClick={()=>supabase.auth.signOut()}>Sign out</button></div></div>;
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} alertCount={alertCount} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} userEmail={user?.email}/><div className="main-column"><Header page={page} setPage={setPage} alertCount={alertCount} query={query} setQuery={setQuery} setMobileOpen={setMobileOpen}/><main className="content">{supabaseConfigured && user && <div className="session-strip"><span>Supabase connected · {user.email}</span><button onClick={()=>supabase.auth.signOut()}>Sign out</button></div>}
    {page==='overview'&&<Overview rows={rows} stats={stats} setPage={setPage} onSelect={t=>setSelectedId(t.id)} onSimulate={()=>setSimOpen(true)}/>}
    {page==='transactions'&&<TransactionsPage rows={rows} query={query} setQuery={setQuery} onSelect={t=>setSelectedId(t.id)} filter={filter} setFilter={setFilter} onExport={exportCsv} onSimulate={()=>setSimOpen(true)}/>}
    {page==='alerts'&&<AlertsPage rows={rows} onSelect={t=>setSelectedId(t.id)} onReview={review}/>}
    {page==='analytics'&&<AnalyticsPage rows={rows} stats={stats}/>}
    {page==='rules'&&<RulesPage rules={rules} setRules={setRules} rows={rows} onResetRules={()=>setRules(DEFAULT_RULES)}/>}
    {page==='settings'&&<SettingsPage rows={rows} onClear={reset} connected={supabaseConfigured} userEmail={user?.email}/>}
    <footer className="app-footer"><span>© {new Date().getFullYear()} FraudShield AI <i/> Synthetic fraud detection prototype</span><span><ShieldCheck size={14}/> Synthetic transactions · No real financial data</span></footer>
  </main></div><Drawer transaction={selected} onClose={()=>setSelectedId(null)} onReview={review}/><Simulator open={simOpen} onClose={()=>setSimOpen(false)} onRun={run}/><Toast toast={toast} onDismiss={()=>setToast(null)}/></div>;
}