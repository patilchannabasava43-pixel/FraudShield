import { CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { riskMeta } from '../config/constants';

export function RiskPill({level,score,small=false}) {
  return <span className={`risk-pill risk-${level} ${small?'small':''}`}><i className="pill-dot" />{score === undefined ? riskMeta[level].label : `${score} · ${riskMeta[level].label}`}</span>;
}

export function PageHeading({eyebrow,title,subtitle,actions}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{actions&&<div className="heading-actions">{actions}</div>}</div>;
}

export function SectionTitle({title,caption,action}) {
  return <div className="section-heading"><div><h3>{title}</h3>{caption&&<p>{caption}</p>}</div>{action}</div>;
}

export function StatCard({title,value,trend,icon:Icon,color,footer,good}) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className={`stat-icon ${color}`}><Icon size={20}/></div></div><div className="stat-value">{value}</div><div className="stat-foot"><span className={`stat-trend ${good?'good':'neutral'}`}>{trend}</span><span>{footer}</span></div></div>;
}

export function ScoreCircle({score,size=120}) {
  const color=score>=70?'#ff6384':score>=40?'#f6bd67':'#55ddb8';
  return <div className="score-circle" style={{width:size,height:size,background:`conic-gradient(${color} ${score*3.6}deg, #272d47 0deg)`}}><div className="score-circle-inner"><strong style={{color}}>{score}</strong><span>/ 100</span></div></div>;
}

export function Switch({checked,onChange,label,help}) {
  return <div className="setting-row"><div><strong>{label}</strong><p>{help}</p></div><button aria-label={`Toggle ${label}`} aria-pressed={checked} className={`switch ${checked?'on':''}`} onClick={()=>onChange(!checked)}><span/></button></div>;
}

export function Toast({toast,onDismiss}) {
  if(!toast)return null;
  return <div className={`toast ${toast.kind||''}`}><div className="toast-icon">{toast.kind==='success'?<CheckCircle2 size={18}/>:<ShieldAlert size={18}/>}</div><div><strong>{toast.title}</strong><p>{toast.detail}</p></div><button aria-label="Dismiss notification" onClick={onDismiss}><X size={16}/></button></div>;
}