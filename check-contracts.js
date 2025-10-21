#!/usr/bin/env node

/**
 * Contract Diagnostic Script
 * Checks your deployed contracts and identifies issues
 */

const CONTRACT_ADDRESSES = {
  IP_REGISTRY: '0x62be70f0015b2398dab49f714762e4886ec24b6e',
  GHOST_WALLET_FACTORY: '0xc17c11ab2736bcab4f69e0c1a75f4a7aafbbf1bb',
  GHOST_WALLET_IMPL: '0xf73d6c9472245ed0eaf3001fca14c1608d4ccae2',
};

const STORY_RPC = 'https://rpc.odyssey.storyrpc.io';

console.log('🔍 Ghost Protocol - Contract Diagnostics\n');
console.log('═'.repeat(60));

async function checkContract(name, address) {
  console.log(`\n📋 Checking ${name}...`);
  console.log(`   Address: ${address}`);
  
  try {
    // Check if contract exists
    const response = await fetch(STORY_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [address, 'latest'],
        id: 1,
      }),
    });
    
    const data = await response.json();
    const code = data.result;
    
    if (code === '0x' || code === '0x0') {
      console.log('   ❌ Status: NOT DEPLOYED');
      console.log('   ⚠️  No code at this address!');
      console.log(`   🔗 Check: https://odyssey.storyscan.io/address/${address}`);
      return false;
    } else {
      console.log('   ✅ Status: DEPLOYED');
      console.log(`   📦 Code size: ${(code.length - 2) / 2} bytes`);
      console.log(`   🔗 Explorer: https://odyssey.storyscan.io/address/${address}`);
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function checkNetwork() {
  console.log('\n🌐 Checking Story Network...');
  
  try {
    const response = await fetch(STORY_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    });
    
    const data = await response.json();
    const chainId = parseInt(data.result, 16);
    
    if (chainId === 1516) {
      console.log('   ✅ Network: Story Protocol Odyssey Testnet');
      console.log('   ✅ Chain ID: 1516');
      console.log('   ✅ RPC: Connected');
      return true;
    } else {
      console.log(`   ❌ Wrong network! Chain ID: ${chainId}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
    return false;
  }
}

async function getBlockNumber() {
  try {
    const response = await fetch(STORY_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });
    
    const data = await response.json();
    const blockNumber = parseInt(data.result, 16);
    console.log(`   📊 Current block: ${blockNumber.toLocaleString()}`);
    return blockNumber;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  // Check network
  const networkOk = await checkNetwork();
  if (!networkOk) {
    console.log('\n❌ Network check failed!');
    process.exit(1);
  }
  
  await getBlockNumber();
  
  console.log('\n' + '═'.repeat(60));
  console.log('📦 Contract Status:');
  console.log('═'.repeat(60));
  
  // Check each contract
  const ipRegistryOk = await checkContract('IP Registry', CONTRACT_ADDRESSES.IP_REGISTRY);
  const factoryOk = await checkContract('Ghost Wallet Factory', CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY);
  const implOk = await checkContract('Ghost Wallet Implementation', CONTRACT_ADDRESSES.GHOST_WALLET_IMPL);
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Summary:');
  console.log('═'.repeat(60));
  
  if (ipRegistryOk && factoryOk && implOk) {
    console.log('\n✅ All contracts are deployed and accessible!');
    console.log('\n💡 If you\'re still getting errors, the issue is likely:');
    console.log('   1. Contract has access control (onlyOwner)');
    console.log('   2. Content already registered');
    console.log('   3. Invalid parameters');
    console.log('   4. Insufficient gas');
    console.log('\n🔍 Next steps:');
    console.log('   1. Check contract owner on explorer');
    console.log('   2. Check browser console for detailed error');
    console.log('   3. Try with a different test file');
  } else {
    console.log('\n❌ Some contracts are not deployed!');
    console.log('\n🔧 Action required:');
    console.log('   1. Redeploy contracts: npx hardhat run scripts/deploy.js --network odyssey');
    console.log('   2. Update addresses in: src/lib/contracts/addresses.ts');
    console.log('   3. Restart your app');
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('🔗 Useful Links:');
  console.log('═'.repeat(60));
  console.log(`   IP Registry: https://odyssey.storyscan.io/address/${CONTRACT_ADDRESSES.IP_REGISTRY}`);
  console.log(`   Factory: https://odyssey.storyscan.io/address/${CONTRACT_ADDRESSES.GHOST_WALLET_FACTORY}`);
  console.log(`   Story Faucet: https://faucet.story.foundation/`);
  console.log('');
}

main().catch(console.error);
