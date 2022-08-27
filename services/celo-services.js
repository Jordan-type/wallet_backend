const ContractKit = require('@celo/contractkit');
const Kit = ContractKit.newKit(process.env.TEST_NET_ALFAJORES);

// helpers, modules, etc.
const { formartNumber } = require('../utils/utils');

// Token Wrappers
const celoTokenWrapper = await Kit.contracts.getGoldToken();
const cusdTokenWrapper = await Kit.contracts.getStableToken();
const ceurTokenWrapper = await Kit.contracts.getStableToken('cEUR');

// @desc send cUSD to a user
// @param {string} sender address - The address of the account to send the transaction from
// @param {string} receiver address - The address of the account to receive the transaction
// @param {string} amount - The amount to send
// @param {string} privateKey - The private key of the account to send the transaction from
// @returns {string} txHash - The transaction hash of the transaction
exports.sendcUSD = async function (sender, receiver, amount, privateKey) {
    
    const amountToTransferInWei = Kit.web3.utils.toWei(amount.toString(), 'ether')
    const senderBalance = await cusdTokenWrapper.balanceOf(sender)

    // check if sender has enough cUSD to send
    if (amount < senderBalance) {
        Kit.addAccount(privateKey)
        const cusdTokenContract = await Kit._web3Contracts.getStableToken()

        const txObject =  await cusdTokenContract.methods.transfer(receiver, amountToTransferInWei)
        const tx = await Kit.sendTransactionObject(txObject, { from: sender, feeCurrency: cusdTokenWrapper.address })

        const txHash = await tx.waitReceipt();

        return txHash

    } else {
        return { 
            error: 'Insufficient funds' 
        };
    }
}

// @desc tranfer  


// @desc Buy Celo to a user
// @param {string} buyerAddress - The address of the account to buy the coins for
// @param {string} amount - The amount to buy
// @param {string} privateKey - The private key of the account to buy the coins for
// @returns {string} txHash - The transaction hash of the transaction
exports.buyCelo = async function(buyerAddress, amount, privateKey) {
    try {

    } catch {

    }
}

// @desc Send celo to a user
// @param {string} sender address - The address of the account to send the transaction from
// @param {string} receiver address - The address of the account to receive the transaction
// @param {string} amount - The amount to send
// @param {string} privateKey - The private key of the account to send the transaction from
// @returns {string} txHash - The transaction hash of the transaction
exports.sendCelo = async function(sender, receiver, amount, privateKey) {

}


// sell celo tokens for cUSD
// @param {string} sellerAddress - The address of the account to sell the coins for
// @param {string} amount - The amount to sell
// @param {string} privateKey - The private key of the account to sell the coins for
// @returns {string} txHash - The transaction hash of the transaction
exports.sellCelo = async function(sellerAddress, amount, privateKey) {


}

// @desc Get the balance of a user
// @param {string} phoneNumber - The address of the account to get the balance of
// @returns {string} balance - The balance of the account
exports.getCeloBalance = async function(phoneNumber) {
    try {
        // const userInfo = 
        // const userWallet = userInfo.walletAddress;
        // celo balance
        let celoBal = await celoTokenWrapper.balanceOf(userWallet);
        let celoBalance = Kit.web3.utils.fromWei(celoBal.toString, 'ether');
        celoBalance = formartNumber(celoBalance, 2);

        // cUSD balance
        let cusdBal = await cusdTokenWrapper.balanceOf(userWallet);
        let cusdBalance = Kit.web3.utils.fromWei(cusdBal.toString, 'ether');
        cusdBalance = formartNumber(cusdBalance, 2);

        // cEUR balance
        let ceurBal = await ceurTokenWrapper.balanceOf(userWallet);
        let ceurBalance = Kit.web3.utils.fromWei(ceurBal.toString, 'ether');
        ceurBalance = formartNumber(ceurBalance, 2);

        // return the balance
        return { celoBalance, cusdBalance, ceurBalance };

    } catch {
        if (error.message.includes('User not found')) {
            return { error: 'User not found' };
        } else  {
            return { error: 'Something went wrong' };
        }
    }
}

// @desc Get wallet details of a user
// @param {string} address - The address of the account to get the wallet details of
// @returns {string} walletDetails - The wallet details of the account
exports.getWalletDetails = async function(address) {

}



