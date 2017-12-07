const Phone = require('phone');
const admin = require('firebase-admin');


module.exports = (req, res) => {
    if(!req.body.phone || !req.body.code) {
        return res.status(422).send({
            message: 'Harap masukan nomer telepon dan code'
        });
    }

    const phone = String(req.body.phone)
                    .replace(/[^\d]/g, '');

    const code = parseInt(String(req.body.code)
                    .replace(/[^\d]/g, ''));   // di database integer
    
    admin.auth().getUser(phone)
        .then((userRecord) => {
            // baca code dari database sesuai noer telepon
            const ref = admin.database().ref('users/' + phone);

            ref.on('value', (snapshot) => { //update real-time, value -> trigger
                ref.off(); // kalau ga dimatiin, data berubah sdkt bakal ke trigger

                const userData = snapshot.val();

                if (userData.code !== code) {
                    return res.status(422).send({
                        message: 'kode anda salah'
                    })
                }

                if (!userData.valid) {
                    return res.status(422).send({
                        message: 'kode anda sudah pernah digunakan'
                    })
                }
                //set valid jadi false
                ref.update({ valid: false })

                //return JWT
                admin.auth().createCustomToken(phone)
                    .then((token) => {
                        res.send({ token: token });
                    });
            })
        })
        .catch((error) => {
            return res.status(422).send(error);
        });

}