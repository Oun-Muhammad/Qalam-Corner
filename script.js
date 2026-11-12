const P=[
{id:1,n:"Gel Pen Set (10 colours)",c:"Pens",p:350,e:"🖊️",b:"#dbeafe"},
{id:2,n:"Ball Pen Box (50)",c:"Pens",p:600,e:"🖋️",b:"#e0e7ff"},
{id:3,n:"Fountain Pen",c:"Pens",p:900,e:"✒️",b:"#fde2e4"},
{id:4,n:"Ruled Notebook A4",c:"Paper",p:220,e:"📓",b:"#fff3b0"},
{id:5,n:"Sketch Pad A3",c:"Paper",p:480,e:"📒",b:"#d8f3dc"},
{id:6,n:"Sticky Notes Pack",c:"Paper",p:150,e:"🗒️",b:"#ffe5b4"},
{id:7,n:"HB Pencils (12)",c:"Art",p:180,e:"✏️",b:"#fff3b0"},
{id:8,n:"Watercolour Set",c:"Art",p:750,e:"🎨",b:"#e9d8fd"},
{id:9,n:"Highlighters (6)",c:"Art",p:420,e:"🖍️",b:"#d8f3dc"},
{id:10,n:"Geometry Box",c:"Desk",p:380,e:"📐",b:"#dbeafe"},
{id:11,n:"Stapler + Pins",c:"Desk",p:320,e:"📎",b:"#fde2e4"},
{id:12,n:"File Folder Set (5)",c:"Desk",p:450,e:"🗂️",b:"#e0e7ff"}];
const $=s=>document.querySelector(s),pg=document.body.dataset.page;
const rs=n=>"Rs "+n.toLocaleString("en-PK");
const esc=s=>s.replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const get=()=>{try{return JSON.parse(localStorage.getItem("cart"))||{}}catch(e){return{}}};
const set=c=>{try{localStorage.setItem("cart",JSON.stringify(c))}catch(e){}count()};
function count(){const e=$("#cc");if(e)e.textContent=Object.values(get()).reduce((a,b)=>a+b,0)}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function add(id){const c=get();c[id]=(c[id]||0)+1;set(c);toast("Added to cart")}
const card=p=>`<article class="card"><div class="thumb" style="background:${p.b}">${p.e}</div><h3>${p.n}</h3><span class="tag">${p.c}</span><span class="price">${rs(p.p)}</span><button class="btn" onclick="add(${p.id})">Add to cart</button></article>`;
// shared header + footer
const f=document.createElement("link");f.rel="stylesheet";f.href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&family=Karla:wght@400;700&display=swap";document.head.appendChild(f);
const L=[["index","Home"],["products","Shop"],["about","About"],["contact","Contact"],["cart","Cart (<span id='cc'>0</span>)"]];
$("#hdr").innerHTML=`<header><div class="wrap bar"><a class="logo" href="index.html">Qalam <span>Corner</span></a><nav>${L.map(l=>`<a href="${l[0]}.html" class="${pg==l[0]?"on":""}">${l[1]}</a>`).join("")}</nav></div></header>`;
$("#ftr").innerHTML=`<footer><div class="wrap">Qalam Corner, Jamshoro, Sindh · Open daily 9am–9pm · Student project: sample shop, no real orders.</div></footer><div id="toast" role="status"></div>`;
// validation: shows message under each empty/invalid required field
function check(form){let ok=true;form.querySelectorAll("[required]").forEach(i=>{const v=i.value.trim();const bad=!v||(i.type=="email"&&!/^\S+@\S+\.\S+$/.test(v))||(i.name=="phone"&&!/^[0-9+\-\s]{10,15}$/.test(v));i.nextElementSibling.textContent=bad?i.dataset.msg:"";if(bad)ok=false});return ok}
function list(){const q=$("#q").value.toLowerCase(),c=$("#cat").value,s=$("#sort").value;let a=P.filter(p=>(!c||p.c==c)&&p.n.toLowerCase().includes(q));if(s=="lo")a.sort((x,y)=>x.p-y.p);if(s=="hi")a.sort((x,y)=>y.p-x.p);$("#list").innerHTML=a.length?a.map(card).join(""):"<p>No items match. Try another search or category.</p>"}
function drawCart(){const c=get(),ids=Object.keys(c);if(!ids.length){$("#cartwrap").innerHTML='<p>Your cart is empty.</p><a class="btn" href="products.html">Browse products</a>';return}
$("#cartbody").innerHTML=ids.map(id=>{const p=P.find(x=>x.id==id);return`<tr><td>${p.e} ${p.n}</td><td class="qty"><button onclick="chg(${id},-1)" aria-label="Decrease">−</button> ${c[id]} <button onclick="chg(${id},1)" aria-label="Increase">+</button></td><td>${rs(p.p*c[id])}</td></tr>`}).join("");
$("#total").textContent=rs(ids.reduce((s,id)=>s+P.find(x=>x.id==id).p*c[id],0))}
function chg(id,d){const c=get();c[id]=(c[id]||0)+d;if(c[id]<=0)delete c[id];set(c);drawCart()}
function order(e){e.preventDefault();if(!check(e.target))return;const n=esc(e.target.name.value.trim());set({});$("#cartwrap").innerHTML=`<h2>Order placed</h2><p>Thank you, ${n}. Your order number is <b>ORD-${Date.now().toString().slice(-6)}</b>. Pay cash on delivery.</p><a class="btn" href="products.html">Keep shopping</a>`}
function send(e){e.preventDefault();if(!check(e.target))return;$("#msg").innerHTML=`<div class="note">Thanks, ${esc(e.target.name.value.trim())}. We will reply within a day.</div>`;e.target.reset()}
if($("#featured"))$("#featured").innerHTML=P.slice(0,4).map(card).join("");
if(pg=="products"){[...new Set(P.map(p=>p.c))].forEach(c=>$("#cat").add(new Option(c,c)));const u=new URLSearchParams(location.search).get("cat");if(u)$("#cat").value=u;["q","cat","sort"].forEach(i=>$("#"+i).addEventListener("input",list));list()}
if(pg=="cart")drawCart();
count();
