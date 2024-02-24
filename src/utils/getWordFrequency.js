import winkNLP from 'wink-nlp';
import lemmatize from 'wink-lemmatizer';
import model from 'wink-eng-lite-web-model';

export const getWordFrequency = (text) => {
  const { its, readDoc } = winkNLP(model);
  const doc = readDoc(text.toLowerCase());
  const map = new Map();

  doc.tokens().each((token) => {
    if (token.out(its.type) === 'word' && !/[".'’]/.test(token.out())) {
      let word = '';
      const pos = token.out(its.pos);

      if (pos === 'NOUN') {
        word = lemmatize.noun(token.out());
      } else if (pos === 'VERB') {
        word = lemmatize.verb(token.out());
      } else if (pos === 'ADJ') {
        word = lemmatize.adjective(token.out());
      } else {
        word = token.out();
      }

      map.set(word, (map.get(word) || 0) + 1);
    }
  });

  return map;
};
