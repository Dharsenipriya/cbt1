FABRIC FITNESS - Full Hyperledger Fabric project (chaincode + client)
================================================================

WHAT'S INCLUDED
- chaincode/fitness-contract.js        : JavaScript chaincode (smart contract)
- chaincode/package.json              : chaincode package descriptor
- app/app.js                          : Node.js Express client using Fabric Gateway SDK
- app/package.json                    : npm package for client
- app/connection.json.example         : placeholder; replace with actual connection profile
- README.txt                          : this file (step-by-step)

IMPORTANT PREREQUISITES (Windows / CMD)
---------------------------------------
1. Install Git for Windows (Git Bash) and enable Git Bash in PATH.
2. Install Docker Desktop and enable WSL2 backend if on Windows.
3. Install Node.js 14+ and npm.
4. Download Hyperledger Fabric samples & binaries:
   - Open Git Bash (not CMD) or WSL — Fabric test-network scripts expect a Linux-like shell.
   - Run:
     git clone https://github.com/hyperledger/fabric-samples.git
     cd fabric-samples
     # checkout recommended version per Fabric docs if needed
     curl -sSL https://bit.ly/2ysbOFE | bash -s

   This creates a 'fabric-samples' folder with the 'test-network' script and binaries.

STEP-BY-STEP: DEPLOY CHAINCODE AND RUN CLIENT (use Git Bash or WSL)
-----------------------------------------------------------------
These commands assume:
  - You put this project folder next to fabric-samples (same parent folder).
  - So you have:
     C:/some/path/fabric-samples
     C:/some/path/fabric-fitness-full

1) Open Git Bash (or WSL). Set variables (adjust paths if different):
   export BASEDIR=$(pwd)
   cd "$BASEDIR/fabric-samples/test-network"

2) Start the test network and create a channel (this starts CA, orderer, peers):
   ./network.sh up createChannel -c mychannel -ca

   Wait until the network is up. The script prints instructions.

3) Deploy the chaincode:
   # From fabric-samples/test-network folder:
   # Adjust the chaincode path to point to this project's chaincode folder
   ./network.sh deployCC -ccn fitness -ccp ../../fabric-fitness-full/chaincode -ccl javascript

   This packages and deploys the chaincode named 'fitness' (version 1.0) to the channel 'mychannel'.

4) Create an application user (appUser) and place identity into client wallet:
   # The test-network provides scripts to create identities.
   # Example using the test-network's org1 enrollment script (run from fabric-samples):
   cd ../../fabric-samples
   # The script below is an example; if it exists run it; otherwise use the register/enroll helpers provided.
   ./test-network/addAppUser.sh

   If your Fabric sample doesn't include that script, use the org's enroll/register scripts in:
   organizations/fabric-ca/registerEnroll.sh
   Example:
   cd organizations/fabric-ca
   ./registerEnroll.sh org1 appUser pw

   After enroll, copy the wallet identity files to the client app's wallet folder:
   # create app wallet folder
   mkdir -p ../../fabric-fitness-full/app/wallet
   # Copy the identity folder for appUser (example path; adjust)
   cp -r ../../fabric-samples/organizations/peerOrganizations/org1.example.com/users/AppUser@org1.example.com/msp ../../fabric-fitness-full/app/wallet/appUser

   NOTE: Exact paths vary by Fabric version. The goal: create a wallet directory under app/wallet containing credentials for 'appUser'.

5) Copy the connection profile for Org1 into the client app folder as connection.json:
   cp ../../fabric-samples/organizations/peerOrganizations/org1.example.com/connection-org1.json ../../fabric-fitness-full/app/connection.json

6) Install Node dependencies and run the client:
   cd ../../fabric-fitness-full/app
   npm install
   npm start

   The client should print: "Client app running on http://localhost:3000"

7) Test the API using curl (from CMD or Git Bash):
   # Create member
   curl -X POST http://localhost:3000/member -H "Content-Type: application/json" -d "{"memberId":"M100","name":"Zoe"}"

   # Award points
   curl -X POST http://localhost:3000/member/M100/award -H "Content-Type: application/json" -d "{"amount":25}"

   # Query
   curl http://localhost:3000/member/M100

   # Transfer
   curl -X POST http://localhost:3000/transfer -H "Content-Type: application/json" -d "{"fromId":"M001","toId":"M100","amount":10}"

TROUBLESHOOTING NOTES
---------------------
- Many Fabric scripts expect a Linux-like shell. On Windows use Git Bash or WSL and run the network scripts there.
- If ./network.sh commands fail, check Docker is running and you have pulled Fabric binaries successfully.
- If the client fails to connect, verify the connection.json path, wallet contents, and that the identity 'appUser' exists.
- If deployCC fails, confirm the chaincode folder is accessible and package.json inside chaincode folder points to the correct main file.

CLEANUP
-------
To tear down the network:
   cd fabric-samples/test-network
   ./network.sh down

ADDITIONAL IMPROVEMENTS
-----------------------
- Add getHistoryForMember in chaincode to read the full transaction history for a key (uses ctx.stub.getHistoryForKey).
- Protect the client API endpoints with proper authentication.

--- End of README ---
