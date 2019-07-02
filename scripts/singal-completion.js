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

const {
    VSTS_URL: vstsUrl,
    PROJECT_ID: projectId,
    HUB_NAME: hubName,
    PLAN_ID: planId,
    JOB_ID: jobId,
    TASK_ID: taskId,
    TOKEN: token,
} = process.env;
const editedToken = `:${token}`;

console.log('Vsts URL:', vstsUrl);
console.log('Project Id:', projectId);
console.log('Hub name:', hubName);
console.log('Plan Id:', planId);
console.log('Job Id:',jobId);
console.log('Task Id:', taskId);
console.log('Token:', token);
console.log('Auto token: ', Buffer.from(editedToken).toString('base64'));

const data = {
    name: 'TaskCompleted',
    result: 'succeeded',
    jobId,
    taskId,
};
const args = process.argv.slice(2);
console.log(args);
if (args[0] === '--succeeded') {
    data.result = 'succeeded';
} else if (args[0] === '--failed') {
    data.result = 'failed';
} else {
    console.error('Please specify one of --succeeded or --failed');
    process.exit(1);
}

const azureUrl = `${vstsUrl}${projectId}/_apis/distributedtask/hubs/${hubName}/plans/`
    + `${planId}/events?api-version=2.0-preview.1`;
axios.post(azureUrl, JSON.stringify(data), {
    headers: {
        'Authorization': `Basic ${Buffer.from(editedToken).toString('base64')}`,
        'Content-Type': 'application/json',
    },
})
.then(({ status }) => {
    console.log(`Response status: ${status}`);
})
.catch(err => {
    console.log(err);
    process.exit(1);
});
