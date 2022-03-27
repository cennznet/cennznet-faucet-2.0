import { useMetaMaskExtension } from "@/libs/providers/MetaMaskExtensionProvider";
import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { MetaMaskAccount } from "@/libs/types";
import { ensureEthereumChain } from "@/libs/utils";
import { Web3Provider } from "@ethersproject/providers";

interface MetaMaskWalletContextType {
	connectWallet: (callback?: () => void) => Promise<void>;
	selectedAccount: MetaMaskAccount;
	wallet: Web3Provider;
}

const MetaMaskWalletContext = createContext<MetaMaskWalletContextType>(
	{} as MetaMaskWalletContextType
);

interface MetaMaskWalletProviderProps {}

const MetaMaskWalletProvider: FC<MetaMaskWalletProviderProps> = ({
	children,
}) => {
	const { extension, promptInstallExtension } = useMetaMaskExtension();
	const [wallet, setWallet] =
		useState<MetaMaskWalletContextType["wallet"]>(null);
	const [selectedAccount, setSelectedAccount] =
		useState<MetaMaskWalletContextType["selectedAccount"]>(null);

	const addCENNZnetToMetaMask = async () => {
		await global.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [
				{
					chainId: "0xbb8",
					blockExplorerUrls: ["https://uncoverexplorer.com"],
					chainName: "CENNZnet Blackthorn",
					nativeCurrency: {
						name: "CPAY",
						symbol: "CPAY",
						decimals: 18,
					},
					rpcUrls: ["https://evm.centrality.me/public"],
				},
			],
		});
	};

	const connectWallet = useCallback(
		async (callback) => {
			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			await ensureEthereumChain(extension);

			const accounts = (await extension.request({
				method: "eth_requestAccounts",
			})) as string[];

			if (!accounts?.length)
				return alert(
					"Please create at least one account in MetaMask extension to continue."
				);

			setSelectedAccount({ address: accounts[0] });
			setWallet(new Web3Provider(extension as any));

			await addCENNZnetToMetaMask();
		},
		[extension, promptInstallExtension]
	);

	useEffect(() => {
		if (!extension) return;
		const checkAccounts = async () => {
			const accounts = (await extension.request({
				method: "eth_accounts",
			})) as string[];
			if (!accounts?.length) return;

			setSelectedAccount({ address: accounts[0] });
			setWallet(new Web3Provider(extension as any));
		};

		checkAccounts();
	}, [extension]);

	useEffect(() => {
		if (!selectedAccount?.address || !extension) return;

		const onAccountsChanged = (accounts: string[]) => {
			if (!accounts?.length) return setSelectedAccount(null);
			setSelectedAccount({ address: accounts[0] });
		};

		extension.on("accountsChanged", onAccountsChanged);

		return () => {
			extension.removeListener("accountsChanged", onAccountsChanged);
		};
	}, [selectedAccount?.address, extension]);

	return (
		<MetaMaskWalletContext.Provider
			value={{ connectWallet, wallet, selectedAccount }}
		>
			{children}
		</MetaMaskWalletContext.Provider>
	);
};

export default MetaMaskWalletProvider;

export function useMetaMaskWallet(): MetaMaskWalletContextType {
	return useContext(MetaMaskWalletContext);
}