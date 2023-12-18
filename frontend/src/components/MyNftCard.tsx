import { FC, FormEvent, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MINT_NFT_CONTRACT } from "../abis/contractsAddress";
import { NftMetadata, OutletContext } from "../types";
import NftCard, { NftCardProps } from "./NftCard";

interface MyNftCardProps extends NftCardProps {
  saleStatus: boolean;
}

const MyNftCard: FC<MyNftCardProps> = ({
  tokenId,
  image,
  name,
  saleStatus,
}) => {
  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);
  const { saleNftContract, account, web3 } = useOutletContext<OutletContext>();

  const onSubmitForSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      await saleNftContract.methods
        .setForSaleNFT(
          // @ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegistedPrice(+price);
      setPrice("");
    } catch (error) {
      console.error(error);
    }
  };

  const getRegistedPrice = async () => {
    try {
      // @ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;

    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div className="group">
      <NftCard tokenId={tokenId} image={image} name={name} />
      {registedPrice ? (
        <div className="mt-4 font-semibold">{registedPrice} ETH</div>
      ) : (
        saleStatus && (
          <form
            onSubmit={onSubmitForSale}
            className="invisible group-hover:visible"
          >
            <input
              type="text"
              className="border-2 border-gray-400 rounded-lg mr-2 mt-4 focus:outline-none pl-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="submit"
              className="hover:cursor-pointer mt-2 rounded-lg bg-blue-600 text-white py-1 px-2 hover:text-gray-300 font-semibold"
              value="List for sale"
            />
          </form>
        )
      )}
    </div>
  );
};

export default MyNftCard;
