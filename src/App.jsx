import { useState } from 'react';
import { parseEpub } from './utils/parseEpub';
import { getWordFrequency } from './utils/getWordFrequency';

const App = () => {
  const [state, setState] = useState([]);

  const handleChange = async (e) => {
    const file = e.target.files.item(0);
    if (file) {
      let result = [];

      if (file.type === 'application/epub+zip') {
        result = getWordFrequency(await parseEpub(file));
      } else if (file.type === 'text/plain' || file.name.endsWith('.srt')) {
        result = getWordFrequency(await file.text());
      }

      setState([...result].sort((a, b) => b[1] - a[1]));
    }
  };

  return (
    <>
      <header className='h-14 shadow bg-white flex items-center font-bold text-2xl '>
        <div className='container mx-auto px-4 md:px-24'>Wordy</div>
      </header>

      <div className='container mx-auto px-4 md:px-24 mt-6'>
        <label className='mb-2 text-sm font-medium' htmlFor='file'>
          Choose .epub, .txt, .srt file
        </label>

        <input
          type='file'
          id='file'
          className='block w-full h-10 border border-gray-200 shadow cursor-pointer file:border-0 file:h-full file:cursor-pointer'
          accept='.epub,.txt,.srt'
          onChange={handleChange}
        />

        {!!state.length && (
          <>
            <h2 className='mt-5 mb-4 font-bold text-xl'>
              Unique Words: {state.length}
            </h2>

            {state.map(([word, frequency]) => (
              <p className='p-2 mb-2 flex shadow font-medium' key={word}>
                {word} - {frequency}
              </p>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default App;
