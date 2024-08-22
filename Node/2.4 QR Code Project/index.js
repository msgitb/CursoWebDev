/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import { input } from '@inquirer/prompts';
import fs from "fs";
import qr from "qr-image";

const url = await input({ message: 'Enter the url you want to generate a qrcode to' });
var qr_svg = qr.image(url, { type: 'png' });
qr_svg.pipe(fs.createWriteStream(`${url}.png`));
 
fs.writeFile("userURL.txt", url, (err)=>{
    if(err) throw err;
});