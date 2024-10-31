// server2.js
const http = require('http');  // Mengimpor modul HTTP untuk membuat server
const url = require('url');    // Mengimpor modul URL untuk mem-parsing URL

class MyExpress {              // Membuat class MyExpress untuk menyimulasikan Express
  constructor() {              
    this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };  // Menyimpan route berdasarkan metode HTTP
    this.middlewares = [];     // Menyimpan middleware yang akan digunakan
  }

  route(method, path, handler) {    // Menambahkan route baru
    this.routes[method][path] = handler;  // Menyimpan handler berdasarkan metode HTTP dan path
  }

  // Fungsi-fungsi pembantu untuk menambahkan route berdasarkan metode HTTP
  get(path, handler) {
    this.route('GET', path, handler);
  }

  post(path, handler) {
    this.route('POST', path, handler);
  }

  put(path, handler) {
    this.route('PUT', path, handler);
  }

  delete(path, handler) {
    this.route('DELETE', path, handler);
  }

  // Fungsi untuk menambahkan middleware
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // Fungsi utama yang menangani request
  handleRequest(req, res) {
    // Memanggil middleware JSON
    this.middlewares.forEach((middleware) => middleware(req, res));

    const parsedUrl = url.parse(req.url, true);  // Mem-parsing URL dari request
    const method = req.method;                   // Mendapatkan metode HTTP
    const routeHandler = this.routes[method][parsedUrl.pathname];  // Mencari handler berdasarkan metode dan path

    if (routeHandler) {                          // Jika route ditemukan
      req.params = parsedUrl.query;              // Menyimpan query parameter
      let body = '';
      req.on('data', (chunk) => { body += chunk; });   // Mengumpulkan body data
      req.on('end', () => {                      // Saat body selesai dibaca
        if (body) req.body = JSON.parse(body);   // Mengurai body ke JSON jika ada
        routeHandler(req, res);                  // Memanggil handler
      });
    } else {                                     // Jika route tidak ditemukan
      res.statusCode = 404;
      res.end('Route not found');
    }
  }

  // Menjalankan server pada port tertentu
  listen(port, callback) {
    const server = http.createServer(this.handleRequest.bind(this));  // Membuat server dan menghubungkan handler
    server.listen(port, callback);    // Mendengarkan pada port yang ditentukan
  }
}

// Inisialisasi instance MyExpress
const app = new MyExpress();
app.use((req, res) => {    // Middleware untuk mengatur header JSON
  res.setHeader('Content-Type', 'application/json');
});

let users = [              // Inisialisasi data user
  { id: 1, name: 'Hafiz' },
  { id: 2, name: 'Gaza' },
];

// GET /api/users - Mendapatkan semua user
app.get('/api/users', (req, res) => {
  res.end(JSON.stringify(users));    // Mengirim data user dalam format JSON
});

// GET /api/users/:id - Mendapatkan user berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));   // Mencari user dengan ID yang cocok
  if (user) res.end(JSON.stringify(user));                          // Mengirim user jika ditemukan
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'User not found' }));           // Mengirim pesan error jika tidak ditemukan
  }
});

// POST /api/users - Menambahkan user baru
app.post('/api/users', (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };    // Membuat user baru
  users.push(newUser);                                              // Menambahkan user ke array users
  res.end(JSON.stringify(newUser));                                 // Mengirim user baru sebagai respons
});

// PUT /api/users/:id - Memperbarui user
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));  // Mencari index user berdasarkan ID
  if (userIndex !== -1) {
    users[userIndex].name = req.body.name;                                    // Memperbarui nama user
    res.end(JSON.stringify(users[userIndex]));                                // Mengirim user yang diperbarui
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'User not found' }));                     // Mengirim pesan error jika tidak ditemukan
  }
});

// DELETE /api/users/:id - Menghapus user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));   // Mencari index user berdasarkan ID
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);                           // Menghapus user
    res.end(JSON.stringify(deletedUser[0]));                                  // Mengirim user yang dihapus
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'User not found' }));                     // Mengirim pesan error jika tidak ditemukan
  }
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');    // Menampilkan pesan saat server berjalan
});
