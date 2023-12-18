import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 10;

const Home: FC = ({}) => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const [supplyitems, setSupplyItems] = useState<any>();

  const { mintNftContract } = useOutletContext<OutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getNFTs();
      }
    });

    if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;

      const totalSupply = await mintNftContract.methods.totalSupply().call();
      const supplyitems = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalSupply));
      setTotalNFT(Number(totalSupply));
      setSupplyItems(Number(supplyitems));
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId - i });
        }
      }

      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNFTs();
  }, [totalNFT]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
  }, [metadataArray]);

  return (
    <>
      <div className="grow ">
        <div className="pl-8 py-12 mt-4 bg-gray-600">
          <img
            className="w-56 h-56 rounded-full "
            src="./images/profile.JPG"
            alt="profile"
          />
          <div className="ml-16 mt-4 text-4xl text-white font-Giants">name</div>
        </div>
        <div className="pl-8 mt-14 font-Giants">{supplyitems} items</div>
        <ul className="p-8 grid grid-cols-5 gap-8">
          {metadataArray?.map((v, i) => (
            <NftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
            />
          ))}
        </ul>
      </div>
      <div ref={detectRef} className="text-gray-400 py-4">
        Detecting Area
      </div>
    </>
  );
};

export default Home;
