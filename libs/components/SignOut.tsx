import { memo, ReactElement } from "react";
import { css } from "@emotion/react";
import { signOut } from "next-auth/react";

interface Props {
	twitterHandle: string;
}

function SignOut({ twitterHandle }: Props): ReactElement<Props> {
	return (
		<div css={styles.root}>
			<span onClick={async () => await signOut({ redirect: false })}>
				Sign out {twitterHandle}
			</span>
		</div>
	);
}

export default memo(SignOut);

const styles = {
	root: ({ palette, transitions }) => css`
		margin: 10px auto;
		width: auto;
		font-size: 14px;
		text-align: center;

		span {
			cursor: pointer;
			font-style: italic;
			text-decoration: underline;
			color: ${palette.text.secondary};
			transition: color ${transitions.short}ms;

			&:hover {
				color: ${palette.primary.main};
			}
		}
	`,
};
