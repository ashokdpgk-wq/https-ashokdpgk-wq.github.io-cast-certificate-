
const API = "YOUR_GOOGLE_SCRIPT_URL";

let all=[];

function load(){
fetch(API)
.then(r=>r.json())
.then(data=>{
all=data;
show(data);
});
}

function show(data){
orders.innerHTML="";
data.reverse().forEach(o=>{
orders.innerHTML += `
<div class="card">
${o.name}<br>
${o.phone}<br>
${o.items}<br>
₹${o.total}<br>

<select onchange="update('${o.id}',this.value)">
<option>Pending</option>
<option>Handover</option>
<option>Received</option>
</select>

</div>`;
});
}

function update(id,status){
fetch(API,{
method:"POST",
body:JSON.stringify({update:true,id,status})
});
}

search.onkeyup=function(){
let v=search.value.toLowerCase();
show(all.filter(o=>o.name.toLowerCase().includes(v)||o.phone.includes(v)));
}

load();
