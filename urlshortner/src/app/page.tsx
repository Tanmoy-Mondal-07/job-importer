import URLInputFild from '@/components/urlinputfild'
import URLDataTable from '@/components/urlDataTable'

export default function Home() {
  return (
    <>
      <div className="pt-20 flex flex-col items-center sm:mx-20 mx-5 space-y-8">
        <h1 className="text-3xl font-bold text-zinc-800 text-center">
          Shorten URLs Instantly
        </h1>

        <URLInputFild />
        <URLDataTable />
      </div>
      </>
      );
}
