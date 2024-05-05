# Coolniqlo
## Instalasi
```js
npm install
npm start run
```
## Data
- Import data **products.json** (/backup-data) ke MongoDB untuk menggunakan data produk 
  atau dengan menambahkan langsung pada Dashboard Admin.
- Import data **admin.json** (/backup-data) ke MongoDB untuk memasukan admin dan user/customer ke
  aplikasi
- Gambar produk ada di public/assets/Items
- Backup data produk ada di folder backup-data 
## Akun (butuh import data admin.json)
- admin@gmail.com dengan password admin123
- tester@gmail.com dengan password tester
- Dapat Sign Up dengan memasukan email, password, dan kode verifikasi
## User Customer
- Customer harus registrasi akun sebelum menambahkan produk ke dalam keranjang (cart)
- Penambahan produk ke cart ditambahkan melalui ikon cart pada atas pojok kiri thumbnail produk
- Pelanggan dapat menghapus akun, menggantikan password, lupa password, dan menambahkan/menggantikan foto
## Cart dan checkout
- Pelanggan dapat menambahkan beberapa produk
- Checkout wajib mengisi alamat tetapi tidak ada Payment API sehingga langsung selesai terbeli
## Dashboard Admin
- Dashboard (*/admin/dashboard*) **hanya** dapat diakses oleh admin
- Gambar yang dimasukkan akan disimpan di public/uploads
- Saat penambahan gambar produk *bigImage*, penambahan *smallImages* harus upload gambar
  yang sama dengan *bigImage* satu kali agar *bigImage* dapat dipilih saat detail produk
- Penambahan produk pada saat add dan edit akan **menghapus** foto yang sebelumnya dipakai
- Order list adalah daftar order yang dilakukan oleh customer dan diurutkan berdasarkan waktu dan tanggal beli
- Sales adalah daftar banyaknya produk yang terjual
## Dashboard Customer
- Di dasboard, customer dapat rate produk yang telah dibeli
- Setiap produk yang dibeli dapat di rate
## Running
- Gunakan **localhost:3000** pada browser untuk menjalankan aplikasi
## Contributor
| NIM|Nama| 
| ------------- |:-------------| 
|535220118|Shinzi|
|535220127|Jonathan Kennedy| 
|535220142|Gabriel Nathanael Irawan|
|535220161|Felix Ferdinand|