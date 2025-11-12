// app/app.js
// Minimal Express server to call the FitnessContract on Fabric (Gateway SDK)

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

async function buildGateway() {
  // Replace connection.json with the connection profile you obtain from the test-network
  const ccpPath = path.resolve(__dirname, 'connection.json');
  if (!fs.existsSync(ccpPath)) {
    throw new Error('connection.json not found in app folder. Copy the connection profile from the test network and name it connection.json');
  }
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(path.resolve(__dirname, 'wallet'));
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',
    discovery: { enabled: true, asLocalhost: true },
  });
  return gateway;
}

app.post('/member', async (req, res) => {
  const { memberId, name } = req.body;
  const gateway = await buildGateway();
  try {
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fitness');
    const result = await contract.submitTransaction('createMember', memberId, name);
    res.json({ success: true, member: JSON.parse(result.toString()) });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  } finally {
    gateway.disconnect();
  }
});

app.post('/member/:id/award', async (req, res) => {
  const memberId = req.params.id;
  const { amount } = req.body;
  const gateway = await buildGateway();
  try {
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fitness');
    const result = await contract.submitTransaction('awardPoints', memberId, String(amount));
    res.json({ success: true, member: JSON.parse(result.toString()) });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  } finally {
    gateway.disconnect();
  }
});

app.post('/transfer', async (req, res) => {
  const { fromId, toId, amount } = req.body;
  const gateway = await buildGateway();
  try {
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fitness');
    const result = await contract.submitTransaction('transferPoints', fromId, toId, String(amount));
    res.json({ success: true, payload: JSON.parse(result.toString()) });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  } finally {
    gateway.disconnect();
  }
});

app.get('/member/:id', async (req, res) => {
  const memberId = req.params.id;
  const gateway = await buildGateway();
  try {
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fitness');
    const result = await contract.evaluateTransaction('queryMember', memberId);
    res.json({ member: JSON.parse(result.toString()) });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  } finally {
    gateway.disconnect();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Client app running on http://localhost:${PORT}`));
