import path from 'path';
import Module from 'module';
import { runInThisContext } from 'vm';
import sourceMapSupport from 'source-map-support';
import { RawSourceMap } from 'source-map-support/node_modules/source-map';

export { RawSourceMap }
const sourceMapList = new Map<string, RawSourceMap>();
sourceMapSupport.install({
  /*
   * Looks for the sourcemap of the module with the specified id
   */
  retrieveSourceMap: id => {
    const map = sourceMapList.get(id);
    if (map === undefined) return null;
    return {
      url: id,
      map,
    };
  }
});

/*
 * Creates a custom require function
 * as the original function assumes the module is a file
 */
const cache: Record<string, Module> = {};
function _require(id: string) {
  /*
   * Reads from the cache, and if there is no module with
   * the specified id, the original require function is called
   */
  const _module = cache[id];
  return _module !== undefined ? _module : require(id);
}

/**
 * Creates a module from the given code and returns its exports
 */
function requireFromString<T = any>(code: string, id: string, sourceMap: RawSourceMap) {

  const _module = new Module(id);

  // If the module is json, parses it and assigns the result to the exports
  if (path.extname(id) === '.json') _module.exports = JSON.parse(code);
  // Otherwise it is assumed to be js code
  else {
    /*
     * Wraps the given code and executes the result, providing a custom require function
     * so that other loaded modules from string can be accessed inside the code
     */
    const wrappedCode = Module.wrap(code);
    const loadModule = runInThisContext(wrappedCode, { filename: id });
    loadModule(_module.exports, _require, _module, __filename, __dirname);

    if (sourceMap != null) sourceMapList.set(id, sourceMap);
  }

  cache[id] = _module.exports;
  return _module.exports as T;
}

export default requireFromString;