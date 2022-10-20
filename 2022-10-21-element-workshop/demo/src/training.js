import {
  button,
  mlpClassifier,
  modelParameters,
  trainingPlot,
  trainingProgress,
} from '@marcellejs/core';
import { postprocess } from './input';
import { store, trainingSet } from './data-storage';

export const classifier = mlpClassifier().sync(store, 'mlp-dashboard');

const b = button('Train');
b.title = 'Training Launcher';
b.$click.subscribe(() =>
  classifier.train(trainingSet.items().map(({ x, y }) => ({ x: postprocess(x), y }))),
);

export const params = modelParameters(classifier);
export const prog = trainingProgress(classifier);
export const plotTraining = trainingPlot(classifier);

export function setupPage(dashboard) {
  dashboard.page('Train Model').use(params, b, prog, plotTraining);
}
