import { RECEIVER_ADDRESS, receiverAbiJson } from './config';
import { ethers } from 'ethers';

export function getReceiverContract(signer){
  return new ethers.Contract(RECEIVER_ADDRESS, receiverAbiJson.abi, signer);
}
