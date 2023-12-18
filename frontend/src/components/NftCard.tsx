import { FC, useState } from "react";
import { Link } from "react-router-dom";

export interface NftCardProps {
  image: string;
  name: string;
  tokenId: number;
}

const NftCard: FC<NftCardProps> = ({ image, name, tokenId }) => {
  return (
    <Link to={`/detail/${tokenId}`}>
      <li className="relative hover:scale-110 duration-300">
        <img src={image} alt={name} className="rounded-xl" />
        <div className="font-Giants text-s mt-1 text-sm">{name}</div>
      </li>
    </Link>
  );
};

export default NftCard;
