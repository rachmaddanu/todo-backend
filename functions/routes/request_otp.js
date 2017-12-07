const client = require('./../twilio_helper');
const mesabot = require('./../secret/mesabot');
const admin = require('firebase-admin');
const Phone = require('phone');
const axios = require('axios');


module.exports = (req, res) => {
    if (!req.body.phone) {
        return res.status(422).send({
            message: 'Harap masukan nomer telepon'
        })
    }

    //sanitazion
    const phone = String(req.body.phone)
                    .replace(/[^\d]/g, '');

    //cek apa udah terdaftar
    admin.auth().getUser(phone)
        .then((userRecord) => {
            const angka = Math.random() * 8999 + 1000; //random return 0-1
            const code = Math.floor(angka); //floor bulatkan ke bawah, ceil ke atas

            const localPhone = Phone(phone, 'ID')[0]; //modul phone merubah nomer ke nomer lokal (ID=+62)

            //mesabot
            // const body = {
            //     "destination": localPhone,
            //     "text": "Your Code Is: "+ code,
            //     // Uncomment line di bawah untuk penggunaan fitur masking
            //     // "masking" => "NAMA_MASKING",
            //   }
              
            //   axios({
            //     method: "POST",
            //     url: "https://mesabot.com/api/v2/send",
            //     data: body,
            //     headers: mesabot
            //   })
            //   .then(() => {
            //     admin.database().ref('users/'+localPhone)
            //     .update({ code: code, valid: true })
            //     .then(() => {
            //         res.send({ message: 'Code has been sent' });
            //     })
            //     .catch((err) => {
            //         res.send(err);
            //     })
            //   }).catch((err) => {
            //     res.send('masalah axios');
            //   })

            // twilio
            client.messages.create({
                body: 'Your Code is: ' + code,
                from:  '+18446217994',
                to: localPhone
            }, (error) => {
                    if(error) {
                        return res.status(422).send(error);
                    }

                    admin.database().ref('users/' + phone)
                        .update({ code: code, valid: true })
                        .then(() => {
                            res.send({ message: 'Code has been sent' });
                        })
                        .catch((error) => {
                            res.send(error)
                        })
                    
            })
        })
        .catch((error) => {
            res.status(422)
                .send('masalah auth')
        });


}

    