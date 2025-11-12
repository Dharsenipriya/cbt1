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

Summary of what you’ll install (order)


Git for Windows (gives Git Bash)


Docker Desktop


Node.js (14+ or 16+ LTS)


(Optional, recommended) WSL2/Ubuntu if you prefer — but not required if you use Git Bash


Clone fabric-samples and run Fabric bootstrap to get binaries


Clone/download your GitHub project (or unzip the ZIP I gave you) into the same parent folder as fabric-samples


Use Git Bash to run the Fabric test network, deploy chaincode, create app user, copy connection profile and credentials into the app/wallet folder


Use CMD (or PowerShell) to run npm install and start the Node client



Step-by-step (exact commands + where to run them)
A. Install Git for Windows (provides Git Bash)


Open Windows CMD (Start → type cmd → Enter).


Download & run Git for Windows installer:


Go to https://git-scm.com/download/win in your browser and download the installer, then run it and accept defaults.


Or from PowerShell (run as Administrator) you can run:
# opens installer link in default browser (paste in PS)
Start-Process "https://git-scm.com/download/win"





After install, you will have Git Bash available in the Start menu. Use Git Bash for Fabric commands later.



Why Git Bash? Fabric scripts are shell scripts that expect a POSIX-like shell. Git Bash provides that without full WSL.


B. Install Docker Desktop


Download Docker Desktop for Windows from https://www.docker.com/products/docker-desktop and run the installer.


During install:


If asked, enable WSL 2 integration or follow the prompts to enable Hyper-V/WSL2.


After install, start Docker Desktop from Start menu.




Open Docker Desktop and ensure it’s running (green “Docker is running” status). If Docker asks to enable WSL2 integration for your Ubuntu distro, accept.



If your Windows edition does not support WSL2/Hyper-V, Docker Desktop may not work. Newer Windows 10/11 versions support it. If you are unsure, tell me your Windows version and I’ll help.


C. Install Node.js (and npm)


Download Node.js LTS from https://nodejs.org and install the Windows installer (choose 16.x or 18.x LTS).


Confirm in CMD:
node -v
npm -v

You should see versions printed (e.g., v18.x.x and npm version).



D. Get Hyperledger Fabric samples & binaries
You will run these steps in Git Bash (not Windows CMD).


Open Git Bash (Start → Git Bash).


Change to a folder where you want the projects (for example C:\Users\You\workspace):
# in Git Bash: change directory to where you keep projects
cd /c/Users/YourWindowsUserName/Documents

Replace path as needed. You can find the equivalent of C:\ as /c/ in Git Bash.


Clone fabric-samples and download binaries (bootstrap). Run these commands in Git Bash:
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples
# The bootstrap script instructions change across versions. The common helper:
curl -sSL https://bit.ly/2ysbOFE | bash -s

The curl script will download required Fabric binaries and docker images. Wait until it finishes. (If curl is missing, install it or use Git Bash built-in curl — recent Git Bash includes curl.)



If the curl line fails, you can follow the Fabric docs to download the binaries manually. Let me know if you need that path.


E. Put your project next to fabric-samples
You said the code is on your GitHub. Two options:
Option 1 — Clone from your GitHub repo
Run in Git Bash (same parent folder that contains fabric-samples):
# example: change URL to your GitHub repo
cd ..
git clone https://github.com/yourusername/your-repo.git fabric-fitness-full

(This makes fabric-fitness-full folder next to fabric-samples.)
Option 2 — If you downloaded the ZIP I made earlier


Move fabric-fitness-full.zip into the same parent folder (e.g., C:\Users\You\Documents) and unzip with Explorer or in Git Bash:
unzip /c/Users/YourWindowsUserName/Documents/fabric-fitness-full.zip -d /c/Users/YourWindowsUserName/Documents/



After you finish, you should have:
/c/Users/You/Documents/fabric-samples
/c/Users/You/Documents/fabric-fitness-full


F. Start Hyperledger Fabric test network (in Git Bash)


In Git Bash:
cd fabric-samples/test-network



Start the network and create a channel:
./network.sh up createChannel -c mychannel -ca



This starts Docker containers for the orderer, peers, CAs, and creates the channel mychannel.


Wait until the script completes. It prints success messages when the network is up.


If you see permission or line-ending errors, ensure you used Git Bash and not CMD.





G. Deploy the chaincode from your project (in Git Bash)


Still in fabric-samples/test-network folder. Deploy chaincode named fitness using the provided helper:
# path to chaincode in your project (adjust if your chaincode folder is named differently)
./network.sh deployCC -ccn fitness -ccp ../../fabric-fitness-full/chaincode -ccl javascript



-ccp path points to the folder containing fitness-contract.js and package.json for chaincode.


The script will package, install, approve and commit the chaincode to channel mychannel.




If deployCC is not available (Fabric sample versions vary), you can instead follow manual packaging and lifecycle commands; tell me if deployCC fails and I’ll give the exact commands for your Fabric version.

H. Create application user (appUser) and copy credentials to the client app
We need an identity named appUser available in the client app app/wallet folder.
Method A — use test-network's provided script (simplest if available)


In Git Bash, from fabric-samples run:
# Some fabric-samples include a script addOrg3AppUser.sh or addAppUser.sh - it varies.
# Look for 'addOrg1User' or similar in test-network folder:
ls ./organizations/peerOrganizations/org1.example.com/users || true
# If test-network includes registerEnroll.sh helpers:
cd organizations/fabric-ca
./registerEnroll.sh org1 appUser pw

If those scripts exist, they will create and enroll appUser and write credential files under fabric-samples/organizations/....


Method B — manual copy from existing Admin identity (common approach)


After the network is up, the sample creates an Admin identity at:
fabric-samples/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp



We’ll create a simple wallet for the client by copying the admin identity (this is acceptable for local test/dev only):
# create wallet folder in your app
mkdir -p ../../fabric-fitness-full/app/wallet/appUser
cp -r ../organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp ../../fabric-fitness-full/app/wallet/appUser/msp

Now the client app has credentials under app/wallet/appUser/msp. (Note: in a production test you should properly register and enroll a dedicated app user via CA.)


Method C — use Fabric CA register/enroll properly (recommended if you want correct appUser credentials). If you want this I’ll give exact fabric-ca-client commands — tell me and I will.

I. Copy connection profile into client app


The test network creates a connection profile JSON for Org1. Copy it into the client app folder as connection.json:
cp ../organizations/peerOrganizations/org1.example.com/connection-org1.json ../../fabric-fitness-full/app/connection.json



Confirm file exists:
ls ../../fabric-fitness-full/app/connection.json




J. Install and run the Node client (you can use Windows CMD or PowerShell)


Open Windows CMD (or PowerShell).


Change to the client app folder:
cd C:\Users\YourWindowsUserName\Documents\fabric-fitness-full\app

(Use the correct absolute path for where you placed the project. You can also run this in Git Bash; both work for Node.)


Install dependencies:
npm install

This will install express, body-parser, and fabric-network packages.


Start the client:
npm start

You should see:
Client app running on http://localhost:3000




K. Test the REST API (CMD, PowerShell, or Git Bash)
Use curl or Postman. On Windows, easiest from CMD with PowerShell curl or use Git Bash curl.
Create a member:
curl -X POST http://localhost:3000/member -H "Content-Type: application/json" -d "{\"memberId\":\"M100\",\"name\":\"Zoe\"}"

Award points:
curl -X POST http://localhost:3000/member/M100/award -H "Content-Type: application/json" -d "{\"amount\":25}"

Query member:
curl http://localhost:3000/member/M100

Transfer points:
curl -X POST http://localhost:3000/transfer -H "Content-Type: application/json" -d "{\"fromId\":\"M001\",\"toId\":\"M100\",\"amount\":10}"

If you prefer Postman, open Postman and POST to http://localhost:3000/member with JSON body.

Troubleshooting pointers (common problems & fixes)


./network.sh not found or permission denied: Make sure you are in Git Bash and in fabric-samples/test-network. Use chmod +x network.sh in Git Bash if needed.


Docker errors: Ensure Docker Desktop is running and you can docker ps in Git Bash. If Docker asks for more resources, allow it.


deployCC not found: Your fabric-samples version may not include that helper. Tell me the fabric-samples version and I’ll provide the exact lifecycle commands.


Client can’t connect (identity or connection.json issues): Confirm app/wallet/appUser/msp exists and app/connection.json points to the right hostnames (for local test-network, the sample connection profile uses localhost and should work).


fabric-network npm install failing: fabric-network compiles native dependencies and needs Python and build tools on some Windows setups. If npm install fails, install the "Windows Build Tools":


Open PowerShell as Admin and run:
npm install --global --production windows-build-tools



Or install Visual Studio Build Tools manually. Git Bash + Node 16 LTS usually avoids many issues, but you may need build tools for some native packages.





If something fails — what to copy to me
If you hit a problem you can’t fix, paste the following into the chat:


The exact command you ran.


The full error text shown in the terminal.


Which terminal you used (CMD / PowerShell / Git Bash).


The output of docker ps (in Git Bash or PowerShell).


The output of ls fabric-fitness-full/app and ls fabric-samples/test-network (in Git Bash).


I’ll tell you exactly what to change.

Final notes / security


We used a copied Admin identity into app/wallet for simplicity. That’s fine for local learning but not for production. For a more correct flow I can show how to register and enroll a separate appUser via Fabric CA.


The chaincode in this project does basic operations (createMember, awardPoints, redeemPoints, transferPoints). For full traceability you can add getHistoryForMember using ctx.stub.getHistoryForKey — I can add that for you.




