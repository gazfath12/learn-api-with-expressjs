// server3.js
const express = require('express');   // Mengimpor Express
const app = express();                // Membuat instance Express

// Middleware untuk mengurai JSON body
app.use(express.json());

let users = [                         // Inisialisasi data user
  { id: 1, name: 'Hafiz' },
  { id: 2, name: 'Gaza' },
];

// GET /api/users - Mendapatkan semua user
app.get('/api/users', (req, res) => {
  res.json(users);                    // Mengirim semua user dalam format JSON
});

// GET /api/users/:id - Mendapatkan user berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));   // Mencari user berdasarkan ID
  if (user) res.json(user);                                         // Mengirim user jika ditemukan
  else res.status(404).json({ error: 'User not found' });           // Mengirim error jika tidak ditemukan
});

// POST /api/users - Menambahkan user baru
app.post('/api/users', (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };    // Membuat user baru
  users.push(newUser);                                              // Menambahkan user ke array users
  res.status(201).json(newUser);                                    // Mengirim user baru sebagai respons dengan kode status 201
});

// PUT /api/users/:id - Memperbarui user
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));  // Mencari index user berdasarkan ID
  if (userIndex !== -1) {
    users[userIndex].name = req.body.name;                                    // Memperbarui nama user
    res.json(users[userIndex]);                                               // Mengirim user yang diperbarui
  } else res.status(404).json({ error: 'User not found' });                   // Mengirim error jika tidak ditemukan
});

// DELETE /api/users/:id - Menghapus user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));   // Mencari index user berdasarkan ID
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);                           // Menghapus user dari array
    res.json(deletedUser[0]);                                                 // Mengirim user yang dihapus
  } else res.status(404).json({ error: 'User not found' });                   // Mengirim error jika tidak ditemukan
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');                                 // Menampilkan pesan saat server berjalan
});
