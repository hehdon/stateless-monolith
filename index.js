import Kernel from './daemon/kernel.js';
import providers from './provider/index.js';
import downloaders from './downloader/index.js';

new Kernel(providers, downloaders).update();