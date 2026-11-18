import { LayoutDashboard, ArrowLeftRight, Siren, ChartNoAxesCombined, SlidersHorizontal } from 'lucide-react';

export const STORAGE = 'fraudshield_phase1_demo_v1';
export const pages = [
  { id:'overview', label:'Overview', icon:LayoutDashboard },
  { id:'transactions', label:'Transactions', icon:ArrowLeftRight },
  { id:'alerts', label:'Fraud alerts', icon:Siren },
  { id:'analytics', label:'Analytics', icon:ChartNoAxesCombined },
  { id:'rules', label:'Detection rules', icon:SlidersHorizontal },
];
export const getStored = () => {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null'); return saved && Array.isArray(saved.transactions) ? saved : null; }
  catch { return null; }
};
export const riskMeta = { high:{label:'High risk',color:'#ff637f'},medium:{label:'Medium risk',color:'#f8b95d'},low:{label:'Low risk',color:'#4dd8b7'} };
export const tooltipStyle = { contentStyle:{background:'#171b34',border:'1px solid #343852',borderRadius:12,color:'#eef0ff',fontSize:12},labelStyle:{color:'#aeb8d4'},itemStyle:{color:'#f3f5ff'} };
export const getCategoryIcon = (name) => {
  if (/transfer|wire|remittance|pay/i.test(name)) return '↗';
  if (/amazon|flipkart|myntra|store|croma|decathlon/i.test(name)) return '◈';
  if (/swiggy|zomato|starbucks|domino/i.test(name)) return '◉';
  return '◇';
};