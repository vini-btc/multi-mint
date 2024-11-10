import { TransactionVersion } from "@stacks/transactions";
import ejs from "ejs";
import path from "path";
import fs from "fs";

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

async function renderContract(addresses, name) {
  const contract = await ejs.renderFile(
    path.resolve("./contracts/airdrop.clar.ejs"),
    {
      accounts: addresses.map((account) =>
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
  fs.writeFileSync(path.resolve(`./contracts/${name}.clar`), contract);
}

(async () => {
  renderContract(_.slice(wallet.accounts, 0, 7000), "airdrop");
  renderContract(_.slice(wallet.accounts, 7000, 14000), "airdrop2");
  renderContract(_.slice(wallet.accounts, 14000, 14995), "airdrop3");

  const stats = fs.statSync("./contracts/nft.clar");
  const fileSizeInBytes = stats.size;

  console.log(`contract file size: ${getReadableFileSize(fileSizeInBytes)}`);
})();
