import ConfigValidator from '../../src/validators/configValidator'
import CentralizedOracle from '../../src/oracles/centralizedOracle'
import CategoricalEvent from '../../src/events/categoricalEvent'
import ScalarEvent from '../../src/events/scalarEvent'
import Market from '../../src/markets'
import { categoricalEventDescription, scalarEventDescription } from '../helpers/market'
import { configDir } from '../helpers/generics'
import Token from '../../src/tokens'
import expect from 'expect.js'

describe('Markets', function () {
  this.timeout(10000)
  it('Categorical Market', async () => {
    const validator = new ConfigValidator(configDir + 'valid_config.json')
    await validator.isValid()
    await validator.normalize()
    const config = validator.getConfig()
    // Issue wrap tokens
    config.collateralToken = config.gnosisJS.contracts.EtherToken.address
    const token = new Token(config)
    const wrappedTokens = await token.wrapTokens()
    expect(wrappedTokens).to.be.an('object')
    // Create Oracle
    const oracle = new CentralizedOracle(categoricalEventDescription, config)
    await oracle.create()
    const oracleAddress = oracle.getAddress()
    expect(oracleAddress).to.be.a('string')
    expect(oracleAddress.length).to.be(42)
    // Create Event
    const eventInfo = Object.assign(categoricalEventDescription, {oracleAddress})
    const event = new CategoricalEvent(eventInfo, config)
    await event.create()
    const eventAddress = event.getAddress()
    expect(eventAddress).to.be.a('string')
    expect(eventAddress.length).to.be(42)
    // Create Market
    const marketInfo = Object.assign(eventInfo, {eventAddress, fee: '1', funding: '1e18', currency: 'ETH'})
    const market = new Market(marketInfo, config)
    await market.create()
    const marketAddress = market.getAddress()
    expect(marketAddress).to.be.a('string')
    expect(marketAddress.length).to.be(42)
  })

  it('Scalar Market', async () => {
    const validator = new ConfigValidator(configDir + 'valid_config.json')
    await validator.isValid()
    await validator.normalize()
    const config = validator.getConfig()
    // Issue wrap tokens
    config.collateralToken = config.gnosisJS.contracts.EtherToken.address
    const token = new Token(config)
    const wrappedTokens = await token.wrapTokens()
    expect(wrappedTokens).to.be.an('object')
    // Create oracle
    const oracle = new CentralizedOracle(scalarEventDescription, config)
    await oracle.create()
    const oracleAddress = oracle.getAddress()
    expect(oracleAddress).to.be.a('string')
    expect(oracleAddress.length).to.be(42)
    // Create event
    const eventInfo = Object.assign(scalarEventDescription, {oracleAddress})
    const event = new ScalarEvent(eventInfo, config)
    await event.create()
    const eventAddress = event.getAddress()
    expect(eventAddress).to.be.a('string')
    expect(eventAddress.length).to.be(42)
    // Create market
    const marketInfo = Object.assign(eventInfo, {eventAddress, fee: '1', funding: '1e18', currency: 'ETH'})
    const market = new Market(marketInfo, config)
    await market.create()
    const marketAddress = market.getAddress()
    expect(marketAddress).to.be.a('string')
    expect(marketAddress.length).to.be(42)
  })
})