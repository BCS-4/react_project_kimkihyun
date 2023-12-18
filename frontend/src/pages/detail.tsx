import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";

const Detail: FC = () => {
  const [metadata, setMetadata] = useState<NftMetadata>();

  const { tokenId } = useParams();

  const { mintNftContract } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const getMyNFT = async () => {
    try {
      if (!mintNftContract) return;

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNFT();
  }, [mintNftContract]);

  return (
    <div className="grow flex justify-center items-center relative">
      <button
        className="absolute top-8 left-8 hover:text-gray-500"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className="text-4xl" />
      </button>
      {metadata && (
        <div className="">
          <img
            className="w-[380px] h-[380px] ml-[50px]"
            src={metadata.image}
            alt={metadata.name}
          />
          <div>
            <div className="font-semibold mt-1 mb-5 text-2xl text-center">
              {metadata.name}
            </div>
            <div className="mb-5 text-center">{metadata.description}</div>
            <ul className="grid grid-cols-3 gap-1">
              {metadata.attributes.map((v, i) => (
                <li
                  key={i}
                  className="flex flex-wrap flex-col text-center w-[140px] m-2 py-2 rounded-xl bg-slate-400"
                >
                  <span className="font-semibold text-lg font-Giants">
                    {v.trait_type}
                  </span>
                  <span> {v.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
