export const getFirstTxBlockNumber = async (address: string): Promise<number | undefined> => {
  const res = await fetch("https://api-goerli.etherscan.io/api?" + new URLSearchParams({
    module: "account",
    action: "txlist",
    address,
    startblock: "0",
    endblock: "99999999",
    sort: "asc",
    apikey: process.env.ETHERSCAN_API_KEY as string,
  }));
  const data = await res.json();
  if (data.status !== "1") {
    return undefined;
  }
  for (const tx of data.result) {
    if (tx.nonce === "0") {
      return parseInt(tx.blockNumber);
    }
  }
  return undefined;
}