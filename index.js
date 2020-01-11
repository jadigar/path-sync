const { readdirSync, statSync } = require('fs');
const { join: localJoin, normalize: localNormalize } = require('path');

const normalize = (path) => {
  const normalized = localNormalize(path);
  // eslint-disable-next-line no-control-regex
  return (/^\\\\\?\\/.test(normalized) || /[^\u0000-\u0080]+/.test(normalized)
    ? normalized
    : normalized.replace(/\\/g, '/'));
};
const join = (...args) => normalize(localJoin(...args));

const isDirectory = (path) => statSync(path).isDirectory();
const getDirectories = (path) => readdirSync(path).map((name) => join(path, name))
  .filter(isDirectory);

const isFile = (path) => statSync(path).isFile();
const getFiles = (path) => readdirSync(path).map((name) => join(path, name))
  .filter(isFile);
const getFilesRecursively = (path) => getDirectories(path)
  .map((dir) => getFilesRecursively(dir))
  .reduce((a, b) => a.concat(b), [])
  .concat(getFiles(path));

module.exports = {
  normalize,
  join,
  isDirectory,
  getDirectories,
  isFile,
  getFiles,
  getFilesRecursively,
};
