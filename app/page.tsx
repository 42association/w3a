/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client";

import CopyButton from "@/coponents/copy_button";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WEB3AUTH_NETWORK,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import Web3 from "web3";

const clientId =process.env.NEXT_PUBLIC_W3A; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x14A34", // hex of 84532
  rpcTarget: "https://sepolia.base.org",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Base Sepolia",
  blockExplorerUrl: "https://sepolia-explorer.base.org",
  ticker: "ETH",
  tickerName: "ETH",
  logo: "https://github.com/base-org/brand-kit/blob/main/logo/symbol/Base_Symbol_Blue.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  uiConfig: {
    appName: "",
  },
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

export default function Home() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginName, setLoginName] = useState<string>("login");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [copytext, setCopytext] = useState<string>("");
  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                sms_passwordless: {
                  name: "sms_passwordless",
                  showOnModal: false,
                },
                facebook: {
                  name: "facebook",
                  showOnModal: false,
                },
                discord: {
                  name: "discord",
                  showOnModal: false,
                },
                twitch: {
                  name: "twitch",
                  showOnModal: false,
                },
                apple: {
                  name: "apple",
                  showOnModal: false,
                },
                twitter: {
                  name: "twitter",
                  showOnModal: false,
                },
                github: {
                  name: "github",
                  showOnModal: false,
                },
                line: {
                  name: "line",
                  showOnModal: false,
                },
                kakao: {
                  name: "kakao",
                  showOnModal: false,
                },
                google: {
                  name: "google",
                  showOnModal: false,
                },
                reddit: {
                  name: "reddit",
                  showOnModal: false,
                },
                linkedin: {
                  name: "linkedin",
                  showOnModal: false,
                },
                weibo: {
                  name: "weibo",
                  showOnModal: false,
                },
                wechat: {
                  name: "wechat",
                  showOnModal: false,
                },
                farcaster: {
                  name: "farcaster",
                  showOnModal: false,
                },
              },
            },
          },
        });
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
        // else {
        //   // Web3Authの初期化が完了した後にloginを自動的に実行
        //   await login();
        // }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  useEffect(() => {
    setLoginName("konaito");
  }, []);
  useEffect(() => {
    setStudentEmail(`${loginName}@student.42tokyo.jp`);
    setCopytext(`${loginName}@student.42tokyo.jp`);
  }, [loginName]);

  function trySetValue(retriesLeft: number) {
    setTimeout(() => {
      try {
        var elements = document.getElementsByName("passwordless-input");
        if (elements.length === 0)
          throw "Element 'passwordless-input' not found";
        elements[0].value = "naito0219@outlook.jp";
      } catch (error) {
        console.error(error);
        if (retriesLeft > 0) trySetValue(retriesLeft - 1);
      }
    }, 20);
  }

  const login = async () => {
    // trySetValue(5); // 5回試行する
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <div className="flex items-center justify-center h-screen p-4" style={{backgroundColor:"#292D39"}}>
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
        <img
          className="w-full"
          src="https://42tokyo.jp/static/images/42ogp_jp.jpg"
          alt="Sunset in the mountains"
        />
        <div className="px-6 pt-4 pb-2">
          <div className="font-bold text-xl">{loginName}さん、ようこそ</div>
          <p className="text-gray-700 text-base px-2 py-3">
            Baseブロックチェーン上で稼働する42tokenを管理する個人ウォレットは、メールアドレスで生成されます。以下のログインボタンからメールアドレスログインを行なってください。初回作成時には、42studentNFTと42tokenが付与されます。推奨は42のemailで、以下からコピーできます。
          </p>
          <div className="relative">
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              value={studentEmail}
              readOnly
            />
            <CopyButton copytext={copytext} />
          </div>
        </div>
        <div className="px-6 pb-4 flex justify-center">
          <button
            className="bg-white hover:bg-white-700 text-black font-bold py-2 px-4 border border-gray-700 rounded"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );

  // <button onClick={login} className="card">
  //   Login
  // </button>

  return (
    <div className="container">
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </div>
  );
}
