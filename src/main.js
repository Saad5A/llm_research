import './styles/tokens.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/components/shared.css';
import './styles/components/phases.css';

import { initTheme } from './services/theme.js';
import { loadAppData } from './services/loader.js';
import { initRouter, registerPageInit } from './services/router.js';
import { mountNavigation } from './components/navigation/Navigation.js';
import { mountPages } from './pages/index.js';
import { initCodeViewer } from './components/code-viewer/CodeViewer.js';
import { initArchitecture } from './pages/architecture/architecture.js';
import { initTraining } from './pages/training/training.js';
import { initBenchmarks } from './pages/benchmarks/benchmarks.js';
import { initGuide } from './pages/guide/guide.js';

async function bootstrap() {
  initTheme();
  await loadAppData();

  mountNavigation(document.getElementById('nav-root'));
  mountPages(document.getElementById('app'));

  registerPageInit('architecture', initArchitecture);
  registerPageInit('training', initTraining);
  registerPageInit('benchmarks', initBenchmarks);
  registerPageInit('guide', initGuide);

  initCodeViewer();
  initRouter();

  initArchitecture();
  initTraining();
  initBenchmarks();
  initGuide();
}

document.addEventListener('DOMContentLoaded', bootstrap);
