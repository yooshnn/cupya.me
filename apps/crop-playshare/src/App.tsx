import { useImages } from '~/hooks/useImages';
import { ActionBar } from '~/ui/crop/ActionBar';
import { Options } from '~/ui/crop/Options';
import { ResultGrid } from '~/ui/crop/ResultGrid';
import { Upload } from '~/ui/crop/Upload';
import { Header } from '~/ui/layout/Header';
import { Hero } from './ui/hero/Hero';

export default function App() {
  const { entries, option, setOption, add, remove, reset, downloadAll, share } = useImages();

  return (
    <div className="w-full max-w-sm mx-auto bg-bg min-h-svh flex flex-col">
      <Header />
      <Hero />
      <div className="flex-1 px-4 pt-5 pb-2 space-y-6 overflow-y-auto">
        <Upload onFiles={add} />
        <Options value={option} onChange={setOption} />
        <ResultGrid entries={entries} onRemove={remove} onReset={reset} />
      </div>
      <ActionBar
        entries={entries}
        onDownloadAll={downloadAll}
        onShare={share}
      />
    </div>
  );
}
