const mesabot = require('./../secret/mesabot');
const admin = require('firebase-admin');
const Phone = require('phone');
const axios = require('axios');

module.exports = (req, res) => {
    //cek body
    if (!req.body.phone) {
        return res
                .status(422)
                .send({ message: "Harap masukan phone"}); 
    }
    //sanitasi
    const phone = String(req.body.phone)
    .replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
    .then((userRecord) => {
        const angka = Math.random() * 8999 + 1000; 
        const code = Math.floor(angka); 

        //const localPhone = Phone(phone, 'ID')[0]; 

        const body = {
            "destination": phone,
            "text": "Your Code Is: "+ code,
            // Uncomment line di bawah untuk penggunaan fitur masking
            // "masking" => "NAMA_MASKING",
          }
          
        axios({
            method: "POST",
            url: "https://mesabot.com/api/v2/send",
            data: body,
            headers: mesabot
        })
        .then(() => {
                admin.database().ref('users/'+phone)
                .update({ code: code, valid: true })
                    .then(() => {
                        res.send({ message: 'Code has been sent' });
                    })
                    .catch((err) => {
                        res.send(err);
                    })
        })
        .catch((err) => {
            res.send('masalah axios');
        })
    })

    .catch(() => {
        admin.auth().createUser({ uid: phone }) 
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
    });

}