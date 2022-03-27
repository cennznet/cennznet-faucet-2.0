import { FC, useCallback, useState } from "react";
import { css } from "@emotion/react";
import { useSession } from "next-auth/react";
import { Divider, SelectChangeEvent } from "@mui/material";
import { CENNZnetToken, TxStatus } from "@/libs/types";
import { SUPPORTED_TOKENS } from "@/libs/constants";
import { supplyAccount } from "@/libs/utils";
import {
	FaucetButton,
	FaucetProgress,
	TokenSelect,
	SignOut,
	MetaMaskAccount,
} from "@/libs/components";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";

const Faucet: FC = () => {
	const { data: session } = useSession();
	const { selectedAccount } = useMetaMaskWallet();
	const [token, setToken] = useState<CENNZnetToken>(SUPPORTED_TOKENS[0]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [response, setResponse] = useState<TxStatus>();

	const onTokenChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		setToken(SUPPORTED_TOKENS.find((token) => token.symbol === value));
	};

	const fetchSupplyResponse = useCallback(async () => {
		if (!selectedAccount) return;
		setResponse({
			message: `Retrieving ${token.symbol} from the Faucet`,
			status: "in-progress",
		});
		setIsOpen(true);
		const supplyResponse = await supplyAccount(
			selectedAccount.address,
			token.assetId
		);

		if (supplyResponse.success) {
			setResponse({
				message: `${token.symbol} sent successfully!`,
				status: "success",
			});
			return;
		}
		setResponse({ message: `Error: ${supplyResponse.error}`, status: "fail" });
	}, [selectedAccount, token]);

	return (
		<div css={styles.faucetWrapper}>
			<div css={styles.faucetContainer}>
				<div css={styles.headingContainer}>
					<p css={styles.heading} style={{ fontWeight: "bold" }}>
						Request Tokens
					</p>
					<div css={styles.tokenSelect}>
						<TokenSelect
							selectedToken={token.symbol}
							onTokenChange={onTokenChange}
						/>
					</div>
				</div>
				<Divider css={styles.divider} />
				<br />
				<MetaMaskAccount />
				<FaucetButton supplyAccount={fetchSupplyResponse} />
				{!!session && <SignOut twitterHandle={session.user.name} />}
				<FaucetProgress
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					txStatus={{ status: response?.status, message: response?.message }}
				/>
			</div>
		</div>
	);
};

export default Faucet;

export const styles = {
	faucetWrapper: css`
		background-color: white;
		box-shadow: 4px 8px 8px rgb(17 48 255 / 10%);
		border-radius: 4px;
		width: 40em;
		padding: 1em 2em;
		@media (max-width: 500px) {
			width: 23em;
		}
	`,
	headingContainer: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0.3em 0 1.2em;
		height: 4em;

		@media (max-width: 500px) {
			height: 6em;
			margin-bottom: 2em;
		}
	`,
	faucetContainer: css`
		width: 100%;
		margin: 0 auto;
		position: relative;
	`,
	heading: css`
		font-size: 24px;
		margin-bottom: 0.5em;
		letter-spacing: 0.5px;
	`,
	tokenSelect: css`
		margin-top: 0.15em;
		display: inline-flex;
		justify-content: space-between;

		@media (max-width: 500px) {
			width: 8em;
			display: block;
		}
	`,
	divider: css`
		margin-left: -2rem;
		width: 40rem;
		margin-top: 2em;

		@media (max-width: 500px) {
			width: 23em;
		}
	`,
};
