import ConnectWallet from '@/components/ConnectWallet'
import NonceCheck from '@/components/NonceCheck'
import Image from 'next/image'

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

interface Params {
  slug: string;
}

interface SearchParams {
  [key: string]: string | undefined;
}

export default function Home({ searchParams }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center gap-4">
        <div className="text-3xl font-bold items-center">
          Distributor
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl">
            Only the true Distributors may mint an NFT.
          </div>
          <div className="text-sm items-center">
            Users who have more than 16 transactions during the period of low activity and<br />prices between Aug 10, 2018 (block 6120000) to July 10, 2020 (block 10430000)
          </div>
          <Image src="/images/ethprice.png" width={700} height={400} alt="Bear market demarcation" />
        </div>
        <ConnectWallet addressVerify={searchParams?.address as string ?? ""} />
        <NonceCheck address={searchParams?.address} />
      </div>
    </main>
  )
}
