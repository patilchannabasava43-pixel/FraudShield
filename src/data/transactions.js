// Fully synthetic data. No bank account, customer or transaction is real.
const fixtures = [
  ['Amazon India','Shopping',1299,'Bengaluru',0,0,1,0,2],
  ['Swiggy','Food & Drinks',389,'Bengaluru',0,0,0,0,1],
  ['Reliance Digital','Electronics',85400,'Singapore',1,1,5,1,0],
  ['Uber','Transport',570,'Bengaluru',0,0,1,0,3],
  ['Flipkart','Shopping',3250,'Mumbai',0,0,1,0,5],
  ['CryptoExchange X','Digital Assets',65200,'Hong Kong',1,1,4,1,8],
  ['Netflix','Subscription',649,'Bengaluru',0,0,1,0,10],
  ['Zomato','Food & Drinks',760,'Bengaluru',0,0,1,0,12],
  ['Global Wire Ltd','Transfer',124500,'Dubai',1,0,6,1,13],
  ['BookMyShow','Entertainment',899,'Bengaluru',0,0,0,0,14],
  ['BigBasket','Groceries',1748,'Bengaluru',0,0,1,0,16],
  ['Apollo Pharmacy','Healthcare',1280,'Bengaluru',0,0,0,0,19],
  ['QuickPay Transfer','Transfer',39500,'Delhi',0,1,4,0,21],
  ['Spotify','Subscription',119,'Bengaluru',0,0,1,0,23],
  ['Myntra','Shopping',2899,'Bengaluru',0,0,1,0,27],
  ['International Store','Shopping',30900,'London',1,1,2,0,30],
  ['HP Fuel Station','Fuel',3000,'Bengaluru',0,0,1,0,34],
  ['Paytm','Utilities',750,'Bengaluru',0,0,1,0,37],
  ['PVR Cinemas','Entertainment',1210,'Bengaluru',0,0,1,0,40],
  ['FraudAlert Store','Shopping',74490,'Toronto',1,1,5,1,44],
  ['Decathlon','Shopping',4290,'Bengaluru',0,0,1,0,48],
  ['IRCTC','Travel',1935,'Bengaluru',0,0,1,0,52],
  ['Starbucks','Food & Drinks',585,'Bengaluru',0,0,1,0,57],
  ['PhonePe','Utilities',2199,'Bengaluru',0,0,1,0,62],
  ['UPI Transfer','Transfer',27500,'Hyderabad',0,1,3,0,65],
  ['MakeMyTrip','Travel',6690,'Bengaluru',0,0,1,0,70],
  ['Croma','Electronics',18990,'Bengaluru',0,0,1,0,74],
  ['Airtel','Utilities',799,'Bengaluru',0,0,1,0,79],
  ['Apple Store','Electronics',54000,'Mumbai',0,0,1,0,85],
  ['Domino’s','Food & Drinks',469,'Bengaluru',0,0,1,0,90],
  ['Urban Company','Services',1800,'Bengaluru',0,0,1,0,94],
  ['Jio','Utilities',349,'Bengaluru',0,0,1,0,99],
  ['Nykaa','Shopping',1860,'Bengaluru',0,0,1,0,110],
  ['Cleartrip','Travel',4599,'Bengaluru',0,0,1,0,118],
  ['Steam Games','Gaming',2749,'Bengaluru',0,1,2,0,125],
  ['Local Mart','Groceries',870,'Bengaluru',0,0,1,0,132],
];

export function initialTransactions() {
  const now = Date.now();
  return fixtures.map(([merchant,category,amount,location,international,newDevice,velocity,suspiciousMerchant,hoursAgo],i)=>({
    id:`TXN-${String(492810-i).padStart(6,'0')}`,
    merchant, category, amount, location, international:!!international,newDevice:!!newDevice,
    velocity, suspiciousMerchant:!!suspiciousMerchant,
    unusualHours: [2,5,8,19].includes(i),
    timestamp:new Date(now-hoursAgo*3600000-((i*19)%60)*60000).toISOString(),
    account:`•••• ${['4821','9056','1073','6682'][i%4]}`,
    channel:['UPI','Card','Bank transfer'][i%3],
    reviewed:null,
  }));
}

export const demoScenarios=[
 {key:'international',label:'International card purchase',merchant:'Overseas Market',category:'Shopping',amount:72500,location:'Singapore',international:true,newDevice:true,velocity:5,suspiciousMerchant:false,unusualHours:true},
 {key:'velocity',label:'Rapid UPI transfers',merchant:'InstantPay Transfer',category:'Transfer',amount:32500,location:'Hyderabad',international:false,newDevice:true,velocity:7,suspiciousMerchant:false,unusualHours:false},
 {key:'normal',label:'Normal grocery purchase',merchant:'Fresh Basket',category:'Groceries',amount:1325,location:'Bengaluru',international:false,newDevice:false,velocity:1,suspiciousMerchant:false,unusualHours:false},
 {key:'high_amount',label:'Unusual large transfer',merchant:'Online Remittance',category:'Transfer',amount:149000,location:'Dubai',international:true,newDevice:true,velocity:4,suspiciousMerchant:true,unusualHours:true}
];

export function simulateTransaction(scenario) {
  return {...scenario,id:`TXN-${String(Date.now()).slice(-8)}`,timestamp:new Date().toISOString(),account:'•••• 4821',channel:scenario.key==='normal'?'UPI':'Card',reviewed:null,simulated:true};
}
