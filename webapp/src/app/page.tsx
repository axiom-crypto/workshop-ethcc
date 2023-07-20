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
    <main className="flex min-h-screen flex-col justify-center items-center p-24">
      <div className="flex flex-col items-center gap-4">
        <div className="text-highlight text-3xl font-bold items-center">
          Distributor NFT
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl">
            Only the chosen ones may mint!
          </div>
          <div className="text-sm items-center">
            { "(Accounts older than 1 hour can mint a Distributor NFT)"}
          </div>
        </div>
        <ConnectWallet addressVerify={searchParams?.address as string ?? ""} />
        <NonceCheck address={searchParams?.address} />
      </div>
    </main>
  )
}
