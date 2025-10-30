import { SHARER_ADDRESS, sharerAbiJson } from './config';
import { ethers } from 'ethers';

export function getSharerContract(signer){
  return new ethers.Contract(SHARER_ADDRESS, sharerAbiJson.abi, signer);
}
