import modelsData from '../data/models.json';
import benchmarksData from '../data/benchmarks.json';
import citationsData from '../data/citations.json';
import glossaryData from '../data/glossary.json';

let cache = null;

export async function loadAppData() {
  if (cache) return cache;
  cache = {
    models: modelsData,
    benchmarks: benchmarksData,
    citations: citationsData,
    glossary: glossaryData,
  };
  return cache;
}

export function getData() {
  if (!cache) throw new Error('App data not loaded. Call loadAppData() first.');
  return cache;
}
