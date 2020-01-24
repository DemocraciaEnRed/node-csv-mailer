"use strict";
const nodemailer = require("nodemailer");

const userDataFile = 'example.txt'

// todos los mails se mandan aleatoriamente en el lapso de:
const waitMax = 5 * 1000 * 60  // 5 mins

const config = {
	host: "smtp.XXX.org",
	port: 465,
	secure: true,
	auth: {
		user: "XXX",
		pass: "XXX"
	}
}

const msg = {
  from: '"XXX" <XXX@XXX.org>', // sender address
  to: null, // list of receivers
  subject: "XXX", // Subject line
  text: null, // plain text body
  html: null // html body
}

const msgBodyText = `XXX

_CONTRA_

XXX`

const msgBodyHtml = `<p>XXX</p>

<p><strong>_CONTRA_</strong></p>

<p>XXX</p>`

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const usus = []
// https://stackabuse.com/reading-and-writing-csv-files-with-node-js/
const csv = require('csv-parser');
const fs = require('fs');
fs.createReadStream(userDataFile)
  .pipe(csv())
  .on('data', (row) => {
		usus.push(row)
  })
  .on('end', () => {
    console.log('Usus cargados');

		const transporter = nodemailer.createTransport(config);
		// https://futurestud.io/tutorials/node-js-how-to-run-an-asynchronous-function-in-array-map
		usus.map(async usu => {
			try{
				let waitTime = getRandomArbitrary(0, waitMax)
				await new Promise((resolve, reject) => setTimeout(resolve, waitTime));

				msg.to = usu.mail;
				msg.text = msgBodyText.replace('_CONTRA_', usu.pass);
				msg.html = msgBodyHtml.replace('_CONTRA_', usu.pass)
				let info = await transporter.sendMail(msg);
			}catch(err) {
				console.log('ERR#' + usu.mail + '#' + err);
			}
		})

  });

