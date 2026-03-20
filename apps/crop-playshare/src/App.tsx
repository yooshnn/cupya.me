import { useImages } from '~/hooks/useImages';
import { ActionBar } from '~/ui/crop/ActionBar';
import { Options } from '~/ui/crop/Options';
import { ResultGrid } from '~/ui/crop/ResultGrid';
import { Upload } from '~/ui/crop/Upload';
import { Header } from '~/ui/layout/Header';

export default function App() {
  const { entries, option, setOption, add, remove, reset } = useImages();

  const handleDownloadAll = () => {
    // milestone 4에서 구현
  };

  const handleShare = () => {
    // milestone 4에서 구현
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-bg min-h-svh flex flex-col">
      <Header />
      <div className="flex-1 px-4 pt-5 pb-2 space-y-6 overflow-y-auto">
        <Upload onFiles={add} />
        <Options value={option} onChange={setOption} />
        <ResultGrid entries={entries} onRemove={remove} onReset={reset} />
      </div>
      <ActionBar
        onDownloadAll={handleDownloadAll}
        onShare={handleShare}
        entries={entries}
      />
    </div>
  );
}
