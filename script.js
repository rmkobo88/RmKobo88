const CART_KEY = "rmkobo88_cart";

let cart =
JSON.parse(
localStorage.getItem(CART_KEY)
) || [];

loadForm();

cekJam();

let menuData = [];

loadCSV();

loadCart();

updatePopupCart();

function cekJam(){

let jam =
new Date().getHours();

let status =
document.getElementById(
"statusBuka"
);

if(jam>=9 && jam<24){

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

container.innerHTML="";

data.forEach(menu=>{

container.innerHTML += `

<div class="menu-card">

${menu.bestseller ?

`<div class="best-seller">

🔥 BEST SELLER

</div>`

:""}

<img

src="${menu.gambar}"

onerror="this.src='no-image.jpg'"

>

<h3>

${menu.nama}

</h3>

<div class="harga">

${menu.harga.toLocaleString()}

RIEL

</div>

${
menu.stok ?

`<button

class="tambah"

onclick="addCart('${menu.nama}')">

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

document

.getElementById("search")

.addEventListener(

"keyup",

function(){

let keyword =

this.value.toLowerCase();

let hasil =

menuData.filter(menu=>

menu.nama

.toLowerCase()

.includes(keyword)

);

renderMenu(hasil);

}

);

function filterMenu(kategori){

if(kategori==="all"){

renderMenu(menuData);

return;

}

let hasil =

menuData.filter(

x=>x.kategori===kategori

);

renderMenu(hasil);

}

function addCart(nama){

let item =

cart.find(

x=>x.nama===nama

);

let menu =

menuData.find(

x=>x.nama===nama

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

saveCart();

updatePopupCart();

}

function tambahItem(nama){

let item =

cart.find(

x => x.nama === nama

);

if(item){

item.qty++;

}

saveCart();

updatePopupCart();

}

function kurangItem(nama){

let item =

cart.find(

x => x.nama === nama

);

if(!item) return;

item.qty--;

if(item.qty<=0){

cart = cart.filter(

x=>x.nama!==nama

);

}

saveCart();

updatePopupCart();

}

function clearCart(){

if(

confirm(

"Kosongkan semua keranjang?"

)

){

cart=[];

localStorage.removeItem(

CART_KEY

);

updatePopupCart();

}

}

function toggleCart(){

document

.getElementById(

"cart-popup"

)

.classList

.toggle("show");

}

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

cart =

JSON.parse(data);

}

updatePopupCart();

}

function updatePopupCart(){

let html="";

let total=0;

cart.forEach(item=>{

let subtotal=

item.harga*

item.qty;

total += subtotal;

html += `

<div class="cart-item">

<b>

${item.nama}

</b>

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

Subtotal :

${subtotal.toLocaleString()}

RIEL

<hr>

</div>

`;

});

if(cart.length===0){

html="Belum ada pesanan";

}

document

.getElementById(

"popup-items"

)

.innerHTML = html;


document

.getElementById(

"popup-total"

)

.innerHTML =

"TOTAL : "

+

total.toLocaleString()

+

" RIEL";


document

.getElementById(

"cart-count"

)

.innerHTML =

cart.reduce(

(total,item)=>

total+item.qty,

0

);

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
"jenisOrder",
document.getElementById(
"jenisOrder"
).value
);

localStorage.setItem(
"nomorMeja",
document.getElementById(
"nomorMeja"
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
"jenisOrder"
).value =

localStorage.getItem(
"jenisOrder"
) || "";

document.getElementById(
"nomorMeja"
).value =

localStorage.getItem(
"nomorMeja"
) || "";

document.getElementById(
"alamatDelivery"
).value =

localStorage.getItem(
"alamatDelivery"
) || "";

tampilkanForm();

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


mejaBox.style.display="none";

alamatBox.style.display="none";


if(jenis==="Dine In"){

mejaBox.style.display="block";

}


if(jenis==="Delivery"){

alamatBox.style.display="block";

}

}

function checkoutWA(){

if(cart.length===0){

alert(
"Keranjang masih kosong"
);

return;

}


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


if(jenisOrder===""){

alert(
"Pilih jenis pesanan"
);

return;

}


if(

jenisOrder==="Dine In"

&&

meja===""

){

alert(
"Pilih nomor meja"
);

return;

}


if(

jenisOrder==="Delivery"

&&

alamat===""

){

alert(
"Masukkan alamat delivery"
);

return;

}


let pesan =

"🍽️ ORDER RM KOBO88\n\n";


pesan +=

"Nama : "

+

nama

+

"\n";


pesan +=

"Jenis : "

+

jenisOrder

+

"\n";


if(jenisOrder==="Dine In"){

pesan +=

"Meja : "

+

meja

+

"\n";

}


if(jenisOrder==="Delivery"){

pesan +=

"Alamat : "

+

alamat

+

"\n";

}


pesan += "\n";


let total=0;


cart.forEach(item=>{

let subtotal=

item.harga*

item.qty;


total += subtotal;


pesan +=

item.nama

+

" x"

+

item.qty

+

" = "

+

subtotal.toLocaleString()

+

" RIEL\n";

});


pesan +=

"\nTOTAL : "

+

total.toLocaleString()

+

" RIEL\n\n";


pesan +=

"Catatan :\n"

+

catatan;


window.open(

"https://wa.me/855719350780?text="

+

encodeURIComponent(pesan),

"_blank"

);

}

function loadCSV(){

Papa.parse(

"menu.csv",

{

download:true,

header:true,

complete:function(results){

menuData =

results.data.map(item=>({

nama:item.nama,

harga:Number(item.harga),

kategori:item.kategori,

gambar:

"images/" +

item.gambar,

stok:

item.stok==="true",

bestseller:

item.bestseller==="true"

}));


renderMenu(menuData);

}

});

}