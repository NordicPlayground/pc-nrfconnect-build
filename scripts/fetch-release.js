/* Copyright (c) 2010 - 2019, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');


let repository;
let name;
let tag;
let version;

const args = process.argv.slice(2);
console.log(args);

// Parse arguments
try {
    if (args[0] && args[1]) {
        repository = args[0];
        name = repository.split('/')[1];
        tag = args[1];
        version = tag.slice(1);
    } else {
        throw new Error('Not enough arguments');
    }
} catch(err) {
    console.log(err.message || err);
    console.error('Please specify repository and tag e.g. NordicSemiconductor/pc-nrfconnect-ble v1.0.0');
    process.exit(1);
}

const fileName =  `${name}-${version}.tgz`;
const destDir = path.resolve(__dirname, '..', '..', '..', fileName);
const url = `https://github.com/${repository}/releases/download/${tag}/${fileName}`;
console.log(`Download artifact from ${url} to ${destDir}`);
Promise.resolve()
.then(() => axios.get(url, {
    headers: { Accept: 'application/octet-stream' },
    responseType: 'stream',
}))
.then(({ data }) => new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destDir, {flags: 'w'});
    writer.on('error', reject);
    data.pipe(writer)
    .on('close', resolve)
    .on('error', reject);
}))
.catch(err => {
    console.log(err.message);
    process.exit(1);
});
