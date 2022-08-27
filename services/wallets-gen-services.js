const ContractKit = require('@celo/contractkit')
const kit = ContractKit.newKit(process.env.TEST_NET_ALFAJORES) // Todo change TEST_NET_ALFAJORES to MAIN_NET_ALFAJORES

// create celo wallet

const createCeloWallet = async() => {
    try {
        const wallet = await kit.web3.eth.accounts.create()
        return wallet
    } catch(error) {
        console.log(error)
    }
}


// create btc wallet 







module.exports = { createCeloWallet }