import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="p-2 flex justify-between font-Giants mb-2">
      <div className="flex gap-4 text-2xl">
        <Link to="/" className="hover:text-gray-200">
          Home
        </Link>
        <Link to="/my" className="hover:text-gray-200">
          My
        </Link>
        <Link to="/sale" className="hover:text-gray-200">
          Sale
        </Link>
      </div>
      <div>
        {account ? (
          <div>
            <span>
              {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </span>
            <button
              className="ml-2 px-2 py-1 rounded-xl bg-blue-400 hover:text-gray-200"
              onClick={() => setAccount("")}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="px-2 py-1 rounded-xl bg-blue-400 hover:text-gray-200"
            onClick={onClickMetaMask}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
