const BN = require('bn.js');

const {
  BaseContract,
} = require('./contract');
const oracleABI = require('../../abi/PriceOracle.json');
const {
  maxPendingAnchorSwing,
  posterAccount,
} = require('../../utils/config/common.config');


class Oracle extends BaseContract {
  constructor(net, oracleAddress, provider) {
    super(net, provider);
    this.poster = posterAccount;
    this.contractAddress = oracleAddress;
    this.contract = new this.web3.eth.Contract(oracleABI, this.contractAddress);
  }

  // pendingAnchors[asset]
  getPendingAnchor(assetAddress) {
    return new Promise((resolve) => {
      this.contract.methods.anchors(assetAddress).call()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          this.log.error('Fail due to ', err.message);
        });
    });
  }

  // capToMax(anchorPrice, price)
  getFinalPrice(asset, anchorPrice, price) {
    // calculate changing ratio
    const changingRatio = (price.toString() - anchorPrice.toString()) / anchorPrice.toString();
    this.log.info(asset, ' changes ratio is', changingRatio);
    if (Math.abs(changingRatio) < maxPendingAnchorSwing) {
      this.log.info(' You are going to write', asset, ' by getting price: ', price.toString());
      return price.toString();
    } else {
      const newRatio = changingRatio > maxPendingAnchorSwing ? maxPendingAnchorSwing : -1 * maxPendingAnchorSwing;
      const finalPrice = anchorPrice.mul(new BN((1 + newRatio) * 10)).div(new BN('10'));
      this.log.info(' You are going to write', asset, ' by getting discount price: ', finalPrice.toString());
      return finalPrice.toString();
    }
  }

  // assetPrices(asset)
  getPrice(assetAddress) {
    return new Promise((resolve) => {
      this.contract.methods._assetPrices(assetAddress).call()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          this.log.error('Fail due to ', err.message);
        });
    });
  }

  // poster
  async getPoster() {
    return new Promise((resolve) => {
      this.contract.methods.poster().call()
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          this.log.error('Fail due to ', err.message);
        });
    });
  }

  // setPrices(address[] assets, uint[] requestedPriceMantissas)
  async setPrices(assets, requestedPrices) {
    const txCount = await this.getNonce(this.poster);
    const data = this.contract.methods.setPrices(assets, requestedPrices).encodeABI();
    const rawTX = await this.txHelper(this.poster, txCount, this.contractAddress, data);
    const transaction = this.signTx(rawTX);

    return await this.web3.eth.sendSignedTransaction(transaction);
  }
}

module.exports = {
  Oracle,
};
