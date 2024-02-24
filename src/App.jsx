import { useState } from 'react';
import { parseEpub } from './utils/parseEpub';
import { getWordFrequency } from './utils/getWordFrequency';

const App = () => {
  const [state, setState] = useState([]);

  const handleChange = async (e) => {
    const file = e.target.files.item(0);
    const parsed = await parseEpub(file);
    const result = getWordFrequency(parsed);
    setState([...result].sort((a, b) => b[1] - a[1]));
  };

  return (
    <>
      <div style={{ margin: '0 5%' }}>
        <input type='file' onChange={handleChange} />
        <h1>Unique Words: {state.length}</h1>

        {!!state.length &&
          state.map(([word, frequency]) => (
            <p key={word}>
              <strong>{word}</strong> - {frequency}
            </p>
          ))}
      </div>
    </>
  );
};

export default App;
