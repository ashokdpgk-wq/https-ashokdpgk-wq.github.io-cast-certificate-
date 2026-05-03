// ================= CONFIG =================
const API = "https://script.google.com/macros/s/AKfycbw3qjvm3KDd-3TbvFcs2E1BPbAGOAnfTmQK1Ul3H9AFWF7L1ITccGeHcYwzuxOdjF-N/exec";

// ================= MESSAGE =================
function showMsg(text, color="#333"){
let box = document.getElementById("msgBox");
box.innerText = text;
box.style.background = color;
box.style.display = "block";
setTimeout(()=> box.style.display="none",2000);
}

// ================= AUTH =================
let user=null;

function showReg(){
loginBox.classList.add("hidden");
regBox.classList.remove("hidden");
}

function register(){
let name=rName.value.trim();
let email=rEmail.value.trim();
let pass=rPass.value.trim();

if(!name||!email||!pass) return showMsg("Fill all ❌","red");

let users=JSON.parse(localStorage.getItem("users")||"[]");

if(users.find(u=>u.email==email)) return showMsg("Email exists ❌","red");

users.push({name,email,pass});
localStorage.setItem("users",JSON.stringify(users));

showMsg("Registered ✅","green");

regBox.classList.add("hidden");
loginBox.classList.remove("hidden");
}

function login(){
let users=JSON.parse(localStorage.getItem("users")||"[]");

let u=users.find(u=>u.email==loginEmail.value && u.pass==loginPass.value);

if(!u) return showMsg("Wrong login ❌","red");

user=u;
localStorage.setItem("currentUser",JSON.stringify(u));

loginBox.classList.add("hidden");
dash.classList.remove("hidden");

loadProducts();
}

function autoLogin(){
let u=JSON.parse(localStorage.getItem("currentUser"));
if(u){
user=u;
loginBox.classList.add("hidden");
dash.classList.remove("hidden");
}
}

function logout(){
localStorage.removeItem("currentUser");
location.reload();
}

// ================= PRODUCT SYSTEM =================

// default products
const defaultProducts = [
{ id:1,name:"Headfone",price:45,img:"Image_1.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_2.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_3.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_4.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_5.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_6.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_7.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_8.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_1.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_2.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_3.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_4.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_5.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_6.jpg"},
{ id:1,name:"Headfone",price:45,img:"Image_7.jpg"},
{ id:2,name:"Headfone",price:45,img:"Image_8.jpg"},
{ id:3,name:"Headfone",price:45,img:"Image_4.jpg"}
];

// admin added products
let products = JSON.parse(localStorage.getItem("products")||"[]");

// merge
function getAllProducts(){
return [...defaultProducts,...products];
}

// add product
function addProduct(){

if(!pName.value||!pPrice.value||!pImg.files[0])
return showMsg("Fill all ❌","red");

let reader=new FileReader();

reader.onload=e=>{
products.push({
id:Date.now(),
name:pName.value,
price:pPrice.value,
img:e.target.result
});

localStorage.setItem("products",JSON.stringify(products));

showMsg("Product Added ✅","green");

pName.value=pPrice.value=pImg.value="";
loadProducts();
};

reader.readAsDataURL(pImg.files[0]);
}

// load products
function loadProducts(){
let all=getAllProducts();
productsDiv().innerHTML="";

all.forEach((p,i)=>{
productsDiv().innerHTML+=`
<div class="product">
<img src="${p.img}"><br>
<div><br>
<span>${p.name}</span><br><span>₹${p.price}</span><br>
<button onclick="add(${i})">Add</button>
</div>
</div>`;
});
}

function productsDiv(){
return document.getElementById("products");
}

// ================= CART =================
let cart=[];

function add(i){
let all=getAllProducts();
cart.push(all[i]);
cartCount.innerText=cart.length;
showMsg("Added 🛒","blue");
}

function openCart(){
cartBox.classList.remove("hidden");
showCart();
}

function closeCart(){
cartBox.classList.add("hidden");
}

function showCart(){
cartList.innerHTML="";
cart.forEach(c=>{
cartList.innerHTML+=`
<div class="card">
<img src="${c.img}" width="40">
${c.name} - ₹${c.price}
</div>`;
});
}

// ================= ORDER =================
function placeOrder(){

if(cart.length==0) return showMsg("Cart empty ⚠️","orange");

let all=JSON.parse(localStorage.getItem("orders")||"[]");

let order={
orderId:"ORD"+Date.now(),
name:cName.value,
mobile:cMobile.value,
village:cVillage.value,
post:cPost.value,
police:cPolice.value,
district:cDistrict.value,
pin:cPin.value,
email:user.email,
items:cart.map(i=>({name:i.name,price:i.price,img:i.img})),
status:"Processing",
date:new Date().toLocaleString()
};

all.push(order);
localStorage.setItem("orders",JSON.stringify(all));

sendToSheet(order);

cart=[];
cartCount.innerText=0;

showMsg("Order Placed ✅","green");
}

// ================= PROFILE =================
function openProfile(){
profileBox.classList.remove("hidden");
loadOrders();
}

function closeProfile(){
profileBox.classList.add("hidden");
}

function loadOrders(){
let arr=JSON.parse(localStorage.getItem("orders")||"[]");
orders.innerHTML="";

arr.filter(o=>o.email==user.email).forEach(o=>{
orders.innerHTML+=`
<div class="card">
<b>${o.orderId}</b><br>
${o.items.map(p=>`<img src="${p.img}" width="40">`).join("")}
<br>Status: ${o.status}
</div>`;
});
}

// ================= ADMIN =================
function openAdmin(){
adminBox.classList.remove("hidden");
}

function checkAdmin(){
if(adminPass.value!="1234") return showMsg("Wrong ❌","red");

adminBox.classList.add("hidden");
adminPanel.classList.remove("hidden");

loadAdmin();
}

function closeAdmin(){
adminPanel.classList.add("hidden");
}

function loadAdmin(){
let arr=JSON.parse(localStorage.getItem("orders")||"[]");
adminOrders.innerHTML="";

arr.forEach((o,i)=>{

let div=document.createElement("div");
div.className="card";

div.innerHTML=`
<b>${o.orderId}</b><br>
${o.name} - ${o.mobile}<br>
${o.items.map(p=>`<img src="${p.img}" width="40">`).join("")}

<select onchange="update(${i},this.value)">
<option>${o.status}</option>
<option>Processing</option>
<option>Shipped</option>
<option>Delivered</option>
<option>Cancelled</option>
</select>
`;

let btn=document.createElement("button");
btn.innerText="−";
btn.style.background="red";
btn.onclick=()=>del(i);

div.appendChild(btn);
adminOrders.appendChild(div);
});
}

function update(i,s){
let a=JSON.parse(localStorage.getItem("orders"));
a[i].status=s;
localStorage.setItem("orders",JSON.stringify(a));
sendToSheet(a[i]);
loadAdmin();
}

function del(i){
let a=JSON.parse(localStorage.getItem("orders"));
a.splice(i,1);
localStorage.setItem("orders",JSON.stringify(a));
loadAdmin();
}

// ================= GOOGLE SHEET =================
function sendToSheet(order){
fetch(API,{
method:"POST",
body:JSON.stringify(order)
});
}

// ================= INIT =================
window.onload=function(){
autoLogin();
loadProducts();
};