// 'use client';

// import { getWords } from './getWords';
// import { useState } from 'react';

// export default function Page() {
//   const [file, setFile] = useState();

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     try {
//       const data = new FormData();
//       data.set('file', file);

//       const res = await fetch('/api/upload', {
//         method: 'POST',
//         body: data,
//       });
//       // handle the error
//       if (!res.ok) throw new Error(await res.text());
//     } catch (e) {
//       // Handle errors here
//       console.error(e);
//     }
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       <input
//         type='file'
//         name='file'
//         onChange={(e) => setFile(e.target.files?.[0])}
//       />
//       <input type='submit' value='Upload' />
//     </form>
//   );
// }

import { writeFile } from 'fs/promises';
import { join } from 'path';

export default function Page() {
  async function upload(data) {
    'use server';

    const file = data.get('file');
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location

    console.log(file.name);
    // const path = join('/', 'tmp', file.name);
    // await writeFile(path, buffer);
    // console.log(`open ${path} to see the uploaded file`);

    return { success: true };
  }

  return (
    <main>
      <h1>React Server Component: Upload</h1>
      <form action={upload}>
        <input type='file' name='file' />
        <input type='submit' value='Upload' />
      </form>
    </main>
  );
}
