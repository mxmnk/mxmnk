import { unzip } from 'unzipit';

const domParser = new DOMParser();
const parseXml = (xml) => domParser.parseFromString(xml, 'application/xml');
const parseHtml = (html) => domParser.parseFromString(html, 'text/html');

const resolvePath = (str, root) => {
  return str[0] === '/' ? str.slice(1) : root + str;
};

const getRoot = (opfPath) => {
  let root = '';

  if (opfPath.includes('/')) {
    root = opfPath.replace(/\/([^/]+)\.opf/i, '');

    if (!root.endsWith('/')) {
      root += '/';
    }

    if (root.startsWith('/')) {
      root = root.replace(/^\//, '');
    }
  }

  return root;
};

const FORBIDDEN_TAGS = [
  'head',
  'link',
  'style',
  'script',
  'textarea',
  'input',
  'svg',
  'img',
  'a',
];

const UNWRAP_TAGS = ['body', 'html', 'div', 'span'];

const cleanHtml = async (text) => {
  const doc = parseXml(text);

  const forbiddenElements = [
    ...doc.querySelectorAll(FORBIDDEN_TAGS.join(', ')),
  ];

  const unwrapElements = [
    ...doc.querySelectorAll(
      UNWRAP_TAGS.map((tag) => `${tag} > *:only-child`).join(', ')
    ),
  ];

  for (const el of forbiddenElements) {
    el.remove();
  }

  for (const el of unwrapElements) {
    el.parentNode?.replaceChildren(...el.childNodes);
  }

  const content = (
    doc.querySelector('body') ?? doc.documentElement
  ).innerHTML.replace(/xmlns="(.*?)"/g, '');

  return content;
};

const ALLOWED_ELEMENTS = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'OL',
  'UL',
  'ADDRESS',
  'BLOCKQUOTE',
  'DL',
]);

const getTextFromNodes = (element) => {
  let text = '';

  if (element.children.length && !ALLOWED_ELEMENTS.has(element.nodeName)) {
    for (const child of element.children) {
      text += getTextFromNodes(child);
    }
  } else {
    text += element.textContent + ' ';
  }

  return text;
};

export const parseEpub = async (file) => {
  const { entries } = await unzip(file);
  const containerXml = parseXml(await entries['META-INF/container.xml'].text());

  let opfPath = containerXml
    .querySelector('rootfile')
    ?.getAttribute('full-path');

  if (!opfPath) {
    return;
  }

  const root = getRoot(opfPath);
  const contentOpf = parseXml(
    await entries[resolvePath('/' + opfPath, root)].text()
  );

  const manifest = contentOpf.querySelector('manifest');
  const spine = [...contentOpf.querySelectorAll('spine > itemref')].map(
    (item) => item.getAttribute('idref')
  );

  let htmlString = '';

  for (const item of spine) {
    const path = manifest
      ?.querySelector(`item[id="${item}"]`)
      ?.getAttribute('href');

    if (!path) {
      return;
    }

    const html = await entries[resolvePath(path, root)].text();
    const cleaned = await cleanHtml(html);
    htmlString += cleaned + ' ';
  }

  return getTextFromNodes(parseHtml(htmlString).body);
};
