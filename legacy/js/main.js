/**
 * main.js — entry point. Kept tiny on purpose: boot.js has already chosen
 * the design; the engine mounts it and wires the "Surprise me" control.
 */
import { start } from './design-engine.js';

start().catch((err) => {
    console.error('[portfolio] failed to start', err);
    document.documentElement.classList.remove('is-design-loading');
});
