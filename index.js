import Kernel from './daemon/kernel.js';
import providers from './provider/index.js';
import downloaders from './downloader/index.js';

const k = new Kernel(providers, downloaders);
if (process.argv[2] === 'cron') {
    k.cron();
} else {
    k.update();
}