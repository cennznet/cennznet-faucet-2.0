import { FC } from "react";
import { css } from "@emotion/react";
import { Divider } from "@mui/material";

const FaucetDetails: FC = () => {
	return (
		<div css={styles.wrapper}>
			<div css={styles.container}>
				<p css={styles.heading}>Faucet Details </p>
				<Divider css={styles.divider} />
				<div css={styles.details}>
					<p css={styles.detailsHeading}>Faucet</p>
					<p>
						The faucet will supply you with 2000 of your selected token, once
						per day per token.
					</p>
				</div>
				<div css={styles.details}>
					<p css={styles.detailsHeading}>Validation</p>
					<p>
						In order to prevent faucet botting, you must sign in via Twitter.
					</p>
					<p>
						Your Twitter account must have at least 1 Tweet, 15 followers, and
						be older than 1 month.
					</p>
				</div>
			</div>
		</div>
	);
};

export default FaucetDetails;

export const styles = {
	wrapper: css`
		background-color: white;
		box-shadow: 4px 8px 8px rgb(17 48 255 / 10%);
		border-radius: 4px;
		width: 40em;
		padding: 0.2em 2em;
		@media (max-width: 500px) {
			width: 23em;
		}
	`,
	container: css`
		width: 100%;
	`,
	heading: css`
		font-size: 24px;
		letter-spacing: 0.5px;
		font-weight: bold;
	`,
	details: css`
		p {
			font-size: 16px;
			line-height: 1.25;
		}
	`,
	detailsHeading: css`
		font-weight: bold;
		letter-spacing: 0.5px;
	`,
	divider: css`
		margin-left: -2em;
		width: 40rem;

		@media (max-width: 500px) {
			width: 23em;
		}
	`,
};