import path from 'path';
import webpack from 'webpack';
import { IFs } from 'memfs';

/**
 * Lists all files in the specified directory
 */
function listDirFiles(_fs: IFs, dirname: string) {
  const files: { name: string, ctime: number }[] = [];

  // Iterates over all the elements directly in the specified directory
  for (const itemName of _fs.readdirSync(dirname) as string[]) {
    const itemPath = path.join(dirname, itemName);

    const stat = _fs.statSync(itemPath);
    // If the current item is a directory, then recursively list all the files inside
    if (stat.isDirectory()) {

      const dirFiles = listDirFiles(_fs, itemPath);
      dirFiles.forEach(f => f.name = itemName + '/' + f.name);
      files.push(...dirFiles);

    // Otherwise, adds the filename and creation time to the list
    } else files.push({
      name: itemName,
      ctime: stat.ctimeMs
    });
  }

  return files;
}

/**
 * Lists all the filenames in order of creation in the output directory of the given compiler
 */
function listFiles(compiler: webpack.Compiler) {
  const { outputFileSystem, outputPath } = compiler;

  return listDirFiles(outputFileSystem as IFs, outputPath)
    .sort((f1, f2) => f1.ctime - f2.ctime)
    .map(f => f.name);
}

export default listFiles;
