const Bluebird = require('bluebird');
const { parse, format } = require('path');
const { readJsonSync, outputJsonSync, pathExistsSync } = require('fs-extra');

class JsonStorage {
  constructor(file, data) {
    this.file = normalizePath(file);
    if (!pathExistsSync(this.file) || !!data) outputJsonSync(this.file, data || {});
  }
  getItem(key) {
    return Bluebird.resolve(readJsonSync(this.file)[key]);
  }

  setItem(key, val) {
    const data = readJsonSync(this.file);
    data[key] = val;
    outputJsonSync(this.file, data);
    return Bluebird.resolve();
  }

  has(key) {
    return Bluebird.resolve(!!readJsonSync(this.file)[key]);
  }

  remove(...keys) {
    const data = readJsonSync(this.file);
    for (const key of keys) {
      delete data[key];
    }
    outputJsonSync(this.file, data);
    return Bluebird.resolve();
  }
  clear() {
    outputJsonSync(this.file, {});
    return Bluebird.resolve();
  }
}

function normalizePath(filepath) {
  const parsed = parse(filepath);
  if (parsed.ext !== '.json') return format(Object.assign({}, parsed, { ext: '.json' }));
  return filepath;
}

exports.JsonStorage = JsonStorage;
exports.Storage = JsonStorage;
exports.default = JsonStorage;
