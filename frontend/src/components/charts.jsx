import { useMemo } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { tooltipStyle } from '../config/constants';
import { SectionTitle } from './ui';

export function RiskBreakdown({stats}) {
  const data=[{name:'Low risk',value:stats.low,color:'#54d8b5'},{name:'Medium risk',value:stats.medium,color:'#ffbc6b'},{name:'High risk',value:stats.high,color:'#ff6888'}];
  return <div className="panel risk-panel"><SectionTitle title="Risk distribution" caption="Transaction risk exposure"/><div className="pie-wrap"><ResponsiveContainer width="100%" height={185}><PieChart><Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={64} outerRadius={83} startAngle={90} endAngle={-270} stroke="none" paddingAngle={4}>{data.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer><div className="pie-overlay"><strong>{stats.total}</strong><span>Transactions</span></div></div><div className="risk-legend">{data.map(d=><div key={d.name}><span><i style={{background:d.color}}/>{d.name}</span><strong>{d.value}<small> ({stats.total?Math.round(d.value/stats.total*100):0}%)</small></strong></div>)}</div></div>;
}

export function ActivityChart({rows}) {
  const data=useMemo(()=>{
    const days=Array.from({length:7},(_,i)=>{let d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(6-i));return {key:d.toDateString(),day:d.toLocaleDateString('en-IN',{weekday:'short'}),normal:0,flagged:0};});
    rows.forEach(t=>{let item=days.find(x=>x.key===new Date(t.timestamp).toDateString());if(item){if(t.level==='high'||t.level==='medium')item.flagged++;else item.normal++;}});return days;
  },[rows]);
  return <ResponsiveContainer width="100%" height={230}><AreaChart data={data} margin={{top:14,right:8,bottom:0,left:-28}}><defs><linearGradient id="areaNormal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7773ff" stopOpacity={.29}/><stop offset="100%" stopColor="#7773ff" stopOpacity={0}/></linearGradient><linearGradient id="areaFlagged" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff7293" stopOpacity={.17}/><stop offset="100%" stopColor="#ff7293" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#2b3048" strokeDasharray="3 6" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#7c85a7',fontSize:11}} dy={12}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#7c85a7',fontSize:11}} allowDecimals={false}/><Tooltip {...tooltipStyle}/><Area type="monotone" dataKey="normal" name="Low risk" stroke="#8583ff" strokeWidth={3} fill="url(#areaNormal)" activeDot={{r:5}}/><Area type="monotone" dataKey="flagged" name="Flagged" stroke="#ff7696" strokeWidth={2.5} fill="url(#areaFlagged)" activeDot={{r:5}}/></AreaChart></ResponsiveContainer>;
}