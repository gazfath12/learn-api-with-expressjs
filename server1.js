// Mengimpor pustaka Express
const MyExpress = require('express');

// Membuat instance aplikasi Express baru
const app = new MyExpress();

// Middleware untuk mengurai body JSON pada permintaan POST, PUT, dan DELETE
app.use(MyExpress.json());

// Mendefinisikan array awal dari data `users`, masing-masing memiliki properti `id` dan `name`
let users = [
  { id: 1, name: 'Hafiz' },
  { id: 2, name: 'Gaza' },
];

// Mendefinisikan route untuk mendapatkan semua data pengguna
app.get('/api/users', (req, res) => {
  // Mengatur header respons untuk menunjukkan konten berupa JSON
  res.setHeader('Content-Type', 'application/json');
  // Mengirimkan array `users` sebagai JSON string dalam respons
  res.end(JSON.stringify(users));
});

// Mendefinisikan route untuk mendapatkan pengguna berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  // Mengambil ID pengguna dari parameter route dan mengonversinya menjadi integer
  const userId = parseInt(req.params.id);

  // Mencari pengguna di array `users` berdasarkan `id`-nya
  const user = users.find((u) => u.id === userId);

  // Jika pengguna ditemukan, mengirimkan data pengguna sebagai JSON
  if (user) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(user));
  } else {
    // Jika pengguna tidak ditemukan, mengatur kode status menjadi 404 dan mengirim pesan
    res.statusCode = 404;
    res.end('User not found');
  }
});

// Mendefinisikan route untuk membuat pengguna baru
app.post('/api/users', (req, res) => {
  // Membuat objek pengguna baru dengan ID yang diincrement dan nama dari body permintaan
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };

  // Menambahkan pengguna baru ke array `users`
  users.push(newUser);

  // Mengatur header untuk menunjukkan konten JSON dan kode status menjadi 201 (created)
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 201;

  // Mengirimkan pengguna baru sebagai JSON dalam respons
  res.end(JSON.stringify(newUser));
});

// Mendefinisikan route untuk memperbarui nama pengguna yang sudah ada berdasarkan ID
app.put('/api/users/:id', (req, res) => {
  // Mengambil ID pengguna dari parameter route
  const userId = parseInt(req.params.id);

  // Mencari indeks pengguna di array `users` berdasarkan `id`-nya
  const userIndex = users.findIndex((u) => u.id === userId);

  // Jika pengguna ditemukan, memperbarui nama mereka dengan nama baru dari body permintaan
  if (userIndex !== -1) {
    users[userIndex].name = req.body.name;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users[userIndex]));
  } else {
    // Jika pengguna tidak ditemukan, mengatur kode status menjadi 404 dan mengirim pesan
    res.statusCode = 404;
    res.end('User not found');
  }
});

// Mendefinisikan route untuk menghapus pengguna berdasarkan ID
app.delete('/api/users/:id', (req, res) => {
  // Mengambil ID pengguna dari parameter route
  const userId = parseInt(req.params.id);

  // Mencari indeks pengguna di array `users` berdasarkan `id`-nya
  const userIndex = users.findIndex((u) => u.id === userId);

  // Jika pengguna ditemukan, menghapusnya dari array `users`
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(deletedUser[0]));
  } else {
    // Jika pengguna tidak ditemukan, mengatur kode status menjadi 404 dan mengirim pesan
    res.statusCode = 404;
    res.end('User not found');
  }
});

// Memulai server pada port 3000 dan menampilkan pesan di konsol
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
