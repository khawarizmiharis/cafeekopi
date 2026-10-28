const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (rq,res) => {
    res.send("heloo dari server!");
});

app.get('/api/produk', (req,res) => {
    const produk = [
        {
            id : 1,
            nama : "Ekspresso",
            harga: 15000
        },
        {
            id : 2,
            nama : "Marcha Latte",
            harga : 200000
        }
    ];
    res.json(produk);
})

app.listen(port, () => {
    console.log(`berhasil berjalan di http//localhost:${port}`)   
}
);
