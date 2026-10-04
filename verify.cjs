const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),listeners={};
const element=s=>{if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',classList:{add(){},remove(){},contains(){return false}},value:''});return elements.get(s)};
const storage=new Map();
const context=vm.createContext({console,Intl,URLSearchParams,TextEncoder,crypto:require('node:crypto').webcrypto,setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{hash:'#inicio'},document:{querySelector:element,addEventListener:(type,fn)=>listeners[type]=fn},window:{addEventListener(){},scrollTo(){}},FormData:class{constructor(f){return new Map(Object.entries(f.values))}}});
vm.runInContext(fs.readFileSync('app.js','utf8').replace(/render\(\);updateSelection\(\);\s*$/,''),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('products.length'),23);assert.equal(run('products.some(p=>p.id===4)'),false);
assert.equal(run("products.every(p=>['Mercadillo','Alamor'].includes(p.origin))"),true);
for(const [category,active] of [['Café','Café'],['Dulces','Productos Lojanos'],['Tradicionales','Productos Lojanos'],['Regalos','Productos Lojanos']]){context.location.hash='#categoria?tipo='+category;run('header()');assert(element('#header').innerHTML.includes('aria-current="page">'+active+'</a>'))}
assert.equal(run("variantPrice(productById(1),'Molido','250 g')"),8.5);
assert.equal(run("variantPrice(productById(1),'Molido','450 g')"),15.3);
assert.equal(run("variantPrice(productById(1),'En grano','450 g')"),16.07);
assert.equal(run("variantPrice(productById(1),'Molido','900 g')"),30.6);
run("add(1,2,'En grano','Sin molienda','450 g')");assert.equal(run('cartTotal()'),32.14);
run("add(1,1,'Molido','Media · filtrado','900 g')");assert.equal(run('cart.length'),2);
run("add(1,1,'En grano','Sin molienda','450 g')");assert.equal(run('cart[0].qty'),3);
assert(run("field('Contraseña','password','password')").includes('minlength="6"'));
assert(run("field('Teléfono','phone','tel')").includes('pattern="[0-9]{10}"'));
assert.equal(run('Object.keys(provinceCities).length'),24);
assert(run('deliveryFields()').includes('required disabled'));
async function submit(type,values){await listeners.submit({target:{dataset:{form:type},reportValidity:()=>true,values},preventDefault(){}})}
(async()=>{
 await submit('auth',{email:'alpha@example.com',password:'a'});assert.equal(run('profile'),null);
 run("authTab='register'");await submit('auth',{email:'alpha@example.com',password:'abcdef',confirm:'abcdef',name:'Alpha',surname:'Test'});assert.equal(run('profile.email'),'alpha@example.com');
 assert.equal(run('accounts[0].digest.length'),64);
 await submit('checkout',{email:'alpha@example.com',phone:'123',province:'Loja',city:'Loja'});assert.equal(run('orders.length'),0);
 await submit('checkout',{email:'alpha@example.com',phone:'0123456789',province:'Loja',city:'Quito'});assert.equal(run('orders.length'),0);
 await submit('checkout',{email:'alpha@example.com',phone:'0123456789',province:'Loja',city:'Loja',address:'Ficticia',payment:'Transferencia'});assert.equal(run('orders.length'),1);assert.equal(run('orders[0].owner'),'alpha@example.com');assert.equal(run('orders[0].items[0].unitPrice'),16.07);
 await submit('tracking',{number:run('orders[0].number'),email:'other@example.com'});assert(element('#tracking-result').innerHTML.includes('No encontramos'));
 await submit('tracking',{number:run('orders[0].number'),email:'alpha@example.com'});assert(element('#tracking-result').innerHTML.includes('Recibido'));
 run("profile={email:'other@example.com',name:'Other'}");assert(!run("ordersView({params:new URLSearchParams()})").includes(run('orders[0].number')));
 run("profile=null;authTab='login'");await submit('auth',{email:'alpha@example.com',password:'wrongpassword'});assert.equal(run('profile'),null);
 await submit('auth',{email:'alpha@example.com',password:'abcdef'});assert.equal(run('profile.email'),'alpha@example.com');
 console.log('OK: navegación, 23 productos, precios, variantes, validaciones, 24 provincias, registro/login, pedidos por cuenta y seguimiento de invitados.');
})().catch(e=>{console.error(e);process.exitCode=1});
