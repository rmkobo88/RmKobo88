const CART_KEY = "rmkobo88_cart";

document
.getElementById("excelFile")
.addEventListener(
"change",
bacaExcel
);

function bacaExcel(e){

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(evt){

const data =
new Uint8Array(
evt.target.result
);

const workbook =
XLSX.read(
data,
{type:'array'}
);

const sheet =
workbook.Sheets[
workbook.SheetNames[0]
];

const hasil =
XLSX.utils.sheet_to_json(
sheet
);

menuData.length = 0;

hasil.forEach(item=>{

menuData.push({

nama:
item.nama,

harga:
Number(item.harga),

kategori:
item.kategori,

gambar:
item.gambar || "",

stok:
String(item.stok)
.toLowerCase()
==="true",

bestSeller:
String(item.bestSeller)
.toLowerCase()
==="true"

});

});

renderMenu(menuData);

};

reader.readAsArrayBuffer(file);

}

let cart =
JSON.parse(
localStorage.getItem(CART_KEY)
) || [];

loadCart();

loadForm();

tampilkanForm();

renderMenu(menuData);

cekJam();

updatePopupCart();

document.getElementById(
"cart-count"
).innerHTML =
cart.reduce(
(total,item)=>
total + item.qty,
0
);

function cekJam(){

let sekarang =
new Date().getHours();

let status =
document.getElementById(
"statusBuka"
);

if(sekarang >= 9 &&
sekarang < 24){

status.innerHTML =
"🟢 OPEN NOW";

}else{

status.innerHTML =
"🔴 CLOSED";

}

}

function renderMenu(data){

let container =
document.getElementById(
"menu-container"
);

container.innerHTML = "";

data.forEach(menu=>{

container.innerHTML += `

<div class="menu-card">

${menu.bestSeller ?

`<div class="best-seller">
🔥 BEST SELLER
</div>`

: ""}

<img
src="${menu.gambar}"
onerror="
this.src='images/no-image.jpg'
">

<h3>${menu.nama}</h3>

<div class="harga">
${menu.harga.toLocaleString()}
 RIEL
</div>

${
menu.stok
?
`<button
class="tambah"
onclick="animTambah(this); addCart('${menu.nama}')">
Tambah
</button>`
:
`<button
class="tambah habis">
Stok Habis
</button>`
}

</div>

`;

});

}

function filterMenu(kategori){

if(kategori==="all"){

renderMenu(menuData);

return;

}

let hasil =
menuData.filter(
x => x.kategori === kategori
);

renderMenu(hasil);

}

function addCart(nama){

let item =
cart.find(
x => x.nama === nama
);

let menu =
menuData.find(
x => x.nama === nama
);

if(item){

item.qty++;

}else{

cart.push({
nama:nama,
harga:menu.harga,
qty:1
});

}

document.getElementById(
"cart-count"
).innerHTML =
cart.reduce(
(total,item)=> total + item.qty,
0
);

updatePopupCart();

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

// animasi keranjang

let cartBtn =
document.getElementById(
"cart-button"
);

cartBtn.classList.add(
"bounce"
);

setTimeout(()=>{

cartBtn.classList.remove(
"bounce"
);

},500);

saveCart();

}

function clearCart(){

cart = [];

localStorage.removeItem(
CART_KEY
);

document.getElementById(
"cart-count"
).innerHTML = 0;

updatePopupCart();

}

function updatePopupCart(){

let html = "";

let total = 0;

cart.forEach(item=>{

let subtotal =
item.harga *
item.qty;

total += subtotal;

html += `

<div class="cart-item">

<b>${item.nama}</b>

<br>

${item.harga.toLocaleString()}
 RIEL

<br><br>

<button
onclick="kurangItem('${item.nama}')">
➖
</button>

<span class="qty">
${item.qty}
</span>

<button
onclick="tambahItem('${item.nama}')">
➕
</button>

<br><br>

Subtotal:
${subtotal.toLocaleString()}
 RIEL

<hr>

</div>

`;

});

if(cart.length===0){

html =
"Belum ada pesanan";

}

document
.getElementById("popup-items")
.innerHTML =
html;

document
.getElementById("popup-total")
.innerHTML =
"TOTAL : " +
total.toLocaleString() +
" RIEL";

}

function tambahItem(nama){

let item =
cart.find(
x => x.nama === nama
);

if(item){

item.qty++;

}

updatePopupCart();

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

saveCart();

}

function kurangItem(nama){

let item =
cart.find(
x => x.nama === nama
);

if(!item) return;

item.qty--;

if(item.qty <= 0){

cart =
cart.filter(
x => x.nama !== nama
);

}

document.getElementById(
"cart-count"
).innerHTML =
cart.reduce(
(total,item)=>
total + item.qty,
0
);

updatePopupCart();

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

saveCart();

}

function toggleCart(){

document
.getElementById("cart-popup")
.classList
.toggle("show");

}

function checkoutWA(){

let jenisOrder =
document.getElementById(
"jenisOrder"
).value;

let meja =
document.getElementById(
"nomorMeja"
).value;

let alamat =
document.getElementById(
"alamatDelivery"
).value;

let nama =
document.getElementById(
"customerName"
).value;

let catatan =
document.getElementById(
"customerNote"
).value;

if(jenisOrder === ""){

alert(
"Pilih jenis pesanan terlebih dahulu"
);

return;

}

if(
jenisOrder === "Dine In"
&&
meja === ""
){

alert(
"Pilih nomor meja"
);

return;

}

if(
jenisOrder === "Delivery"
&&
alamat === ""
){

alert(
"Masukkan alamat delivery"
);

return;

}

let pesan =
"🍽️ ORDER RM KOBO88\n\n";

pesan +=
"Nama: " +
nama +
"\n\n";

pesan +=
"Meja: " +
meja +
"\n\n";

pesan +=
"Jenis Order: " +
jenisOrder +
"\n";

if(jenisOrder === "Dine In"){

pesan +=
"Meja: " +
meja +
"\n";

}

if(jenisOrder === "Delivery"){

pesan +=
"Alamat: " +
alamat +
"\n";

}

pesan += "\n";

let total = 0;

cart.forEach(item=>{

let subtotal =
item.harga *
item.qty;

total += subtotal;

pesan +=
item.nama +
" x" +
item.qty +
" = " +
subtotal.toLocaleString() +
" RIEL\n";

});

pesan +=
"\nTOTAL : " +
total.toLocaleString() +
" RIEL\n\n";

pesan +=
"Catatan:\n" +
catatan;

window.open(
"https://wa.me/855719350780?text=" +
encodeURIComponent(pesan),
"_blank"
);

}

document
.getElementById("search")
.addEventListener(
"keyup",
function(){

let keyword =
this.value.toLowerCase();

let hasil =
menuData.filter(menu =>

menu.nama
.toLowerCase()
.includes(keyword)

);

renderMenu(hasil);

}
);

function saveCart(){

localStorage.setItem(
CART_KEY,
JSON.stringify(cart)
);

}

function loadCart(){

let data =
localStorage.getItem(
CART_KEY
);

if(data){

cart = JSON.parse(data);

document.getElementById(
"cart-count"
).innerHTML =
cart.reduce(
(total,item)=>
total + item.qty,
0
);

updatePopupCart();

}

}

function saveForm(){

localStorage.setItem(
"customerName",
document.getElementById(
"customerName"
).value
);

localStorage.setItem(
"customerNote",
document.getElementById(
"customerNote"
).value
);

localStorage.setItem(
"nomorMeja",
document.getElementById(
"nomorMeja"
).value
);

localStorage.setItem(
"jenisOrder",
document.getElementById(
"jenisOrder"
).value
);

localStorage.setItem(
"alamatDelivery",
document.getElementById(
"alamatDelivery"
).value
);

}

function loadForm(){

document.getElementById(
"customerName"
).value =
localStorage.getItem(
"customerName"
) || "";

document.getElementById(
"customerNote"
).value =
localStorage.getItem(
"customerNote"
) || "";

document.getElementById(
"nomorMeja"
).value =
localStorage.getItem(
"nomorMeja"
) || "";

document.getElementById(
"jenisOrder"
).value =
localStorage.getItem(
"jenisOrder"
) || "";

document.getElementById(
"alamatDelivery"
).value =
localStorage.getItem(
"alamatDelivery"
) || "";

}

function tampilkanForm(){

let jenis =
document.getElementById(
"jenisOrder"
).value;

let mejaBox =
document.getElementById(
"mejaBox"
);

let alamatBox =
document.getElementById(
"alamatBox"
);

if(jenis === "Dine In"){

mejaBox.style.display =
"block";

alamatBox.style.display =
"none";

}
else if(
jenis === "Delivery"
){

mejaBox.style.display =
"none";

alamatBox.style.display =
"block";

}
else{

mejaBox.style.display =
"none";

alamatBox.style.display =
"none";

}

}

function animTambah(btn){

btn.classList.add(
"clicked"
);

setTimeout(()=>{

btn.classList.remove(
"clicked"
);

},300);

}

document
.getElementById("excelFile")
.addEventListener("change", bacaExcel);

function bacaExcel(e){

const file = e.target.files[0];

const reader = new FileReader();

reader.onload = function(evt){

const data = new Uint8Array(evt.target.result);

const workbook =
XLSX.read(data,{type:'array'});

const sheet =
workbook.Sheets[
workbook.SheetNames[0]
];

const hasil =
XLSX.utils.sheet_to_json(sheet);

menuData.length = 0;

hasil.forEach(item=>{

menuData.push({

nama:item.nama,

harga:Number(item.harga),

kategori:item.kategori,

gambar:item.gambar || "",

stok:
String(item.stok)
.toLowerCase()
==="true",

bestSeller:
String(item.bestSeller)
.toLowerCase()
==="true"

});

});

renderMenu(menuData);

};

reader.readAsArrayBuffer(file);

}