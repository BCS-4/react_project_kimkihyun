import { FC, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import MyNftCard from "../components/MyNftCard";
import { SALE_NFT_CONTRACT } from "../abis/contractsAddress";
import { HiOutlineRefresh } from "react-icons/hi";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);
  const { mintNftContract, account } = useOutletContext<OutletContext>();
  const [nftitems, setNftItems] = useState<any>();

  const navigate = useNavigate();

  const getNftSupply = async () => {
    try {
      if (!mintNftContract) return;

      const nftitems = await mintNftContract.methods
        // @ts-expect-error
        .balanceOf(account)
        .call();

      setNftItems(Number(nftitems));
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  const getMyNFTs = async () => {
    try {
      if (!mintNftContract || !account) return;

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          // @ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(tokenId))
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
      }

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  const getSaleStatus = async () => {
    try {
      const isApproved: boolean = await mintNftContract.methods
        // @ts-expect-error
        .isApprovedForAll(account, SALE_NFT_CONTRACT)
        .call();

      setSaleStatus(isApproved);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSaleStatus = async () => {
    try {
      await mintNftContract.methods
        // @ts-expect-error
        .setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus)
        .send({
          from: account,
        });

      setSaleStatus(!saleStatus);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);

  useEffect(() => {
    if (!account) return;

    getSaleStatus();
  }, [account]);

  useEffect(() => {
    getNftSupply();
  }, [mintNftContract]);

  return (
    <>
      <div className="grow">
        <div className="flex flex-col p-2">
          <div className="flex font-semibold">
            Sale Approved : {saleStatus ? "TRUE" : "FALSE"}
            <button
              className="hover:text-gray-200 ml-2"
              onClick={onClickSaleStatus}
            >
              <HiOutlineRefresh />
            </button>
          </div>
          <button
            className="hover:text-gray-200 text-left mt-2 bg-blue-400 w-fit px-2 py-1 rounded-xl font-semibold"
            onClick={onClickMintModal}
          >
            Mint
          </button>
        </div>
        <div className="text-center py-8">
          <h1 className="font-bold text-4xl font-Giants">My NFTs</h1>
        </div>
        <div className="pl-8 mt-14 font-Giants">{nftitems} items</div>
        <ul className="p-8 grid grid-cols-5 gap-8">
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
              saleStatus={saleStatus}
            />
          ))}
        </ul>
      </div>
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;
