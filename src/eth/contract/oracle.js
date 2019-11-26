const BN = require('bn.js')

const {
    BaseContract
} = require('./contract')
const oracleABI = require('../../abi/PriceOracle.json')
const {
    adminAccount,
    maxPendingAnchorSwing,
    posterAccount,
} = require('../../utils/config/common.config')


class Oracle extends BaseContract {
    constructor(net, log, oracleAddress) {
        super(net, log)
        this.admin = adminAccount
        this.poster = posterAccount
        this.contractAddress = oracleAddress
        this.contract = new this.web3.eth.Contract(oracleABI, this.contractAddress)
    }

    // pendingAnchors[asset]
    getPendingAnchor(assetAddress) {
        return new Promise((resolve, reject) => {
            this.contract.methods.anchors(assetAddress).call()
                .then(result => {
                    resolve(result.priceMantissa)
                })
                .catch(err => {
                    this.log.error("Fail due to ", err.message)
                })
        })
    }

    // capToMax(anchorPrice, price)
    getFinalPrice(asset, input, standard) {
        if (Math.abs(input) < maxPendingAnchorSwing) {
            this.log.info(" You are going to write", asset, " by getting price: ", input.toString())
            return input
        } else {
            let newRatio = input > maxPendingAnchorSwing ? maxPendingAnchorSwing : -1 * maxPendingAnchorSwing
            let finalPrice = standard.mul(new BN((1 + newRatio) * 10)).div(new BN("10"))
            this.log.info(" You are going to write", asset, " by getting discount price: ", finalPrice.toString())
            return finalPrice
        }
    }

    // assetPrices(asset)
    getPrice(assetAddress) {
        return new Promise((resolve, reject) => {
            this.contract.methods.assetPrices(assetAddress).call()
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    this.log.error("Fail due to ", err.message)
                })
        })
    }

    // _setPendingAnchor(asset, newScaledPrice)
    async setPendingAnchor(asset, newAnchorPrice) {
        let txCount = await this.getNonce(this.admin)
        let data = this.contract.methods._setPendingAnchor(asset, newAnchorPrice).encodeABI()
        let rawTX = await this.txHelper(txCount, this.contractAddress, data)
        let transaction = this.signTx(rawTX)

        return new Promise((resolve, reject) => {
            this.web3.eth.sendSignedTransaction(transaction)
                .once("confirmation", (number, receipt) => {
                    this.log.info('Transaction hash is: ', receipt.transactionHash)
                    this.log.info("Transaction has been confirmed!")
                    let status = receipt.status;
                    resolve({
                        status
                    })
                })
                .on("error", (err) => {
                    reject(err)
                })
                .catch(err => this.log.error(err.message))
        })
    }

    // setPrices(address[] assets, uint[] requestedPriceMantissas)
    async setPrices(assets, requestedPrices) {
        let txCount = await this.getNonce(this.baseAccount)
        let data = this.contract.methods.setPrices(assets, requestedPrices).encodeABI()
        let rawTX = await this.txHelper(txCount, this.contractAddress, data)
        let transaction = this.signTx(rawTX)

        return new Promise((resolve, reject) => {
            this.web3.eth.sendSignedTransaction(transaction)
                .once("confirmation", (number, receipt) => {
                    this.log.info('Transaction hash is: ', receipt.transactionHash)
                    this.log.info("Transaction has been confirmed!")
                    let status = receipt.status;
                    resolve({
                        status
                    })
                })
                .on("error", (err) => {
                    reject(err)
                })
                .catch(err => this.log.error(err.message))
        })
    }
}

module.exports = {
    Oracle,
}
