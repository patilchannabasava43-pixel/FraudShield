import { useState } from 'react';
import { ShieldCheck, Settings2, Search, Bell, ChevronDown, ArrowUpRight, Menu, Sparkles, ChevronRight } from 'lucide-react';
import { pages } from '../config/constants';

export function Sidebar({page,setPage,alertCount,mobileOpen,setMobileOpen,userEmail}) {
  return <>
    {mobileOpen&&<div className="mobile-scrim" onClick={()=>setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen?'mobile-open':''}`}>
      <div className="brand" onClick={()=>{setPage('overview');setMobileOpen(false)}} role="button" tabIndex={0}>
        <div className="brand-mark"><ShieldCheck size={24} strokeWidth={2.4}/></div>
        <div className="brand-words"><strong>FraudShield<span>AI</span></strong><small>INTELLIGENT SECURITY</small></div>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="workspace-select"><div className="workspace-icon">F</div><div><strong>FraudShield Demo</strong><small>Personal workspace</small></div><ChevronDown size={15}/></div>
      <div className="nav-heading">MAIN MENU</div>
      <nav className="sidebar-nav">
        {pages.map(item=><button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>{setPage(item.id);setMobileOpen(false)}}><item.icon size={19} strokeWidth={1.9}/><span>{item.label}</span>{item.id==='alerts'&&alertCount>0&&<span className="nav-count">{alertCount}</span>}</button>)}
      </nav>
      <div className="nav-heading others">OTHER</div>
      <nav className="sidebar-nav"><button className={`nav-item ${page==='settings'?'active':''}`} onClick={()=>{setPage('settings');setMobileOpen(false)}}><Settings2 size={19}/><span>Settings</span></button></nav>
      <div className="sidebar-spacer" />
      <div className="assistant-card"><div className="assistant-symbol"><Sparkles size={19}/></div><strong>Meet your fraud copilot</strong><p>Explore patterns, detect anomalies, and understand risk.</p><span>Demo intelligence <ArrowUpRight size={14}/></span></div>
      <div className="sidebar-user"><div className="avatar">DA</div><div><strong>{userEmail ? userEmail.split('@')[0] : 'Demo Analyst'}</strong><small>{userEmail || 'Local demo'}</small></div><span className="online-dot"/></div>
    </aside>
  </>;
}

export function Header({page,setPage,alertCount,query,setQuery,setMobileOpen}) {
  const [openSearch,setOpenSearch] = useState(false);
  return <header className="topbar">
    <div className="breadcrumb"><button className="menu-icon" aria-label="Open menu" onClick={()=>setMobileOpen(true)}><Menu size={21}/></button><span>Workspace</span><ChevronRight size={15}/><strong>{page==='overview'?'Dashboard':page==='alerts'?'Fraud alerts':page==='rules'?'Detection rules':page[0].toUpperCase()+page.slice(1)}</strong></div>
    <div className="topbar-right"><div className={`top-search ${openSearch?'search-open':''}`}><Search size={17}/><input aria-label="Search transactions" value={query} placeholder="Search transactions..." onFocus={()=>{setOpenSearch(true);setPage('transactions')}} onChange={e=>{setQuery(e.target.value);setPage('transactions')}}/><kbd>⌘ K</kbd></div><span className="topbar-divider"/><button className="icon-button notification" aria-label="View fraud alerts" title="View alerts" onClick={()=>setPage('alerts')}><Bell size={19}/>{alertCount>0&&<i/>}</button><div className="top-avatar">DA</div></div>
  </header>;
}