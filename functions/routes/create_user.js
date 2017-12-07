const admin = require('firebase-admin');

module.exports = (req, res) => {
    //(ToDo)
    //terima nomer telepon
    if (!req.body.phone) {
        return res
                .status(422)
                .send({ message: "Harap masukan phone"}); 
        //httpstatuses.com, kalau lgsng send, sistem ngirim status 200, makanya diset dulu statusnya
    }


    const phone = String(req.body.phone)
                        .replace(/[^\d]/g, '');
                        //^ = not, g = all, \d = angka

    //(ToDo)
    // daftarkan nomer telepon tersebut ke firebase auth
    // kalau nomernya sudah pernah didaftar send error
    // kalau belom, daftarkan, lalu sen succes
    admin.auth().createUser({ uid: phone }) //then, catch bisa dipakai ketika ada promise
    .then((user) => {
        return res
                .status(201)
                .send('berhasil SignUp');
    })
    .catch((error) => {
        return res
                .status(422)
                .send(error);
    });
}

// module.exports = {
// list nama function, kalau export banyak
// }