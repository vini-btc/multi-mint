import {
  generateWallet,
  generateSecretKey,
  generateNewAccount,
  getStxAddress,
} from "@stacks/wallet-sdk";
import { TransactionVersion } from "@stacks/transactions";
import _ from "lodash";
import ejs from "ejs";
import path from "path";
import fs from "fs";

const password = "password";
const secretKey = generateSecretKey();

let wallet = await generateWallet({
  secretKey,
  password,
});

_.range(4000).forEach(() => {
  wallet = generateNewAccount(wallet);
});

function getReadableFileSize(fileSizeInBytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = fileSizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

(async () => {
  const contract = await ejs.renderFile(
    path.resolve("./contracts/nft.clar.ejs"),
    {
      accounts: wallet.accounts.map((account) =>
        getStxAddress({
          account,
          transactionVersion: TransactionVersion.Testnet,
        })
      ),
    },
    {
      escape: (str) => str,
    }
  );
  fs.writeFileSync(path.resolve("./contracts/nft.clar"), contract);
  const stats = fs.statSync("./contracts/nft.clar");
  const fileSizeInBytes = stats.size;
  console.log(`contract file size: ${getReadableFileSize(fileSizeInBytes)}`);
})();
