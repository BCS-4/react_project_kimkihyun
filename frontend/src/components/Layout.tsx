import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3, { Contract, ContractAbi } from "web3";
import { useSDK } from "@metamask/sdk-react";

import Header from "./Header";
import mintNftAbi from "../abis/mintNftAbi.json";
import saleNftAbi from "../abis/saleNftAbi.json";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();
  const [mintNftContract, setMintNftContract] =
    useState<Contract<ContractAbi>>();
  const [saleNftContract, setSaleNftContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(
      new web3.eth.Contract(
        mintNftAbi,
        "0xF58605CE70C1a7F2e21F9b9535eBf83C39b6e30E"
      )
    );
    setSaleNftContract(
      new web3.eth.Contract(
        saleNftAbi,
        "0xbd237Eb74f74fA3dC50458f5Ac98465E1183c3E8"
      )
    );
  }, [web3]);

  return (
    <div className="min-h-screen max-w-screen-md mx-auto flex flex-col">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract, saleNftContract }} />
    </div>
  );
};

export default Layout;
