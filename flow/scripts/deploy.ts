import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const deployment = await ethers.deployContract('talkTuah');

  console.log('talkTuah address:', await deployment.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//POC
//Hardhart, ether.js library to deploy the contract to a test ethereum blockchian
