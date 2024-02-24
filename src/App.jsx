import { parseEpub } from './utils/parseEpub';

const App = () => {
  const handleChange = async (e) => {
    const file = e.target.files.item(0);

    if (file) {
      const parsed = await parseEpub(file);
      console.log(parsed);
    }
  };

  return (
    <>
      <input type='file' onChange={handleChange} />
    </>
  );
};

export default App;
