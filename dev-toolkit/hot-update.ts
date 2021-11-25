import hotUpdater from './emitter';

// Defines HMR interface because the original is incorrect
type Hot = Omit<__WebpackModuleApi.Hot, 'check'> & {
  check: (autoApply: boolean) => Promise<string[]>
}
const hot = module.hot as unknown as Hot;

// Gets the id of the current chunk
const installedChunks = __webpack_require__.hmrS_require;
const chunkId = Object.keys(installedChunks)[0];

const msgPrefix = `[HMR:${chunkId}]`;

/**
 * Performs updates to the current chunk
 * and overrides the exports of the entry module for the given output
 */
async function updateChunk(
  output: Record<string, any>,
  moduleIdsByChunkName: Record<string, string>,
  reloadChunk: (chunkId: string) => void
) {

  if (hot.status() === 'idle') try {

    // Uses HMR api to check and apply updates
    const updatedModules: string[] = await hot.check(true);
    if (updatedModules?.length > 0) {

      console.log(`${msgPrefix} Updated modules:`);
      updatedModules.forEach(moduleId => console.log(` - ${moduleId}`));
      
      const entryModuleId = moduleIdsByChunkName[chunkId];
      output[chunkId] = __webpack_require__(entryModuleId);

    } else {
      console.warn(`${msgPrefix} Cannot find update.`);
    }

  } catch (error) {

    if (['abort', 'fail'].includes(hot.status())) {
      console.warn(`${msgPrefix} Cannot apply update:`, error);
    } else {
      console.error(`${msgPrefix} Update failed:`, error);
    }
    // Reloads the chunk on error
    reloadChunk?.(chunkId);
    console.warn(`${msgPrefix} Reloaded.`);

  }
};

// Adds an event listener to be able to call the above function from other modules
hotUpdater.on('update chunks', updateChunk);
