import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "@/libs/providers/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import CssGlobal from "@/components/CssGlobal";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<CssBaseline />
			<ThemeProvider>
				<CssGlobal />
				<Head>
					<title>CENNZnet App Faucet</title>
					<meta
						name="description"
						content="Testnet token faucet powered by CENNZnet"
					/>
					<link rel="icon" href="/favicon.svg" />
				</Head>
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
	);
}

export default MyApp;
