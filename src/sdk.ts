// Import types for solidity
import { Uint256, Uint32, Uint160, Address, Int256, Int24 } from 'soltypes'
import { ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'

import AlphaVault from '../artifacts/contracts/AlphaVault.sol/AlphaVault.json'

// todo: Store types in a separate file.
type DepositResult = {
    shares: Uint32
    amount0: Uint32
    amount1: Uint32
}
type WithdrawResult = {
  amount0: Uint256
  amount1: Uint256
}
type TotalAmounts = {
  total0: Uint256
  total1: Uint256
}

export default class SDK {
  contractAddress: Address;
  _contract: Contract

  constructor(contractAddress: Address, abi = AlphaVault, provider = new ethers.providers.JsonRpcProvider()) {
    this.contractAddress = contractAddress;
    this._connect(contractAddress, abi, provider)
  }

  _connect(contractAddress: Address, abi, provider) {
    this._contract = new ethers.Contract(contractAddress as unknown as string, abi, provider)
  }

  async deposit (
    amount0Desired: Uint256,
    amount1Desired: Uint256,
    amount0Min: Uint256,
    amount1Min: Uint256,
    to: Address
  ): Promise<DepositResult> {
    const result: DepositResult = await this._execute('deposit', arguments)
    return result
  }

  async withdraw(
    shares: Uint256,
    amount0Min: Uint256,
    amount1Min: Uint256,
    to: Address
  ): Promise<WithdrawResult> {
    const result: WithdrawResult = await this._execute('withdraw', arguments)
    return result
  }

  async rebalance(
    swapAmount: Int256,
    sqrtPriceLimitX96: Uint160,
    _baseLower: Int24,
    _baseUpper: Int24,
    _bidLower: Int24,
    _bidUpper: Int24,
    _askLower: Int24,
    _askUpper: Int24
  ): Promise<void> {
    await this._execute('rebalance', arguments)
  }

  async getTotalAmounts(): Promise<TotalAmounts> {
    const result: TotalAmounts = await this._execute('getTotalAmounts', arguments)
    return result
  }

  async _execute (method: string, args: IArguments): Promise<any> {
    let result: any
    try {
      result = await this._contract[method].apply(this._contract, arguments)
    } catch(e) {
      console.error(`Error while trying to execute "${method}"`, e)
      throw e
    }
    return result
  }
}
