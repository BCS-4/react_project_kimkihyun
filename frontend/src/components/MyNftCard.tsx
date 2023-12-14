import { FC } from "react";
import NftCard, { NftCardProps } from "./NftCard";

interface MyNftCardProps extends NftCardProps {}

const MyNftCard: FC<MyNftCardProps> = ({ tokenId, image, name }) => {
  return (
    <div>
      <NftCard tokenId={tokenId} image={image} name={name} />
      <div>판매 기능</div>
    </div>
  );
};

export default MyNftCard;
