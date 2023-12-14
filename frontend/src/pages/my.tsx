import { FC, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import MyNftCard from "../components/MyNftCard";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

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

  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);

  return (
    <>
      <div className="grow">
        <div className="text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className="text-center py-8">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className="p-8 grid grid-cols-2 gap-8">
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
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
