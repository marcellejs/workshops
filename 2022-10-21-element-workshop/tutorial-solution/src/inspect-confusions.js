import {
  batchPrediction,
  button,
  confusionMatrix,
  dataset,
  datasetBrowser,
  text,
  throwError,
} from '@marcellejs/core';
import { postprocess } from './input';
import { store, trainingSet } from './data-storage';
import { classifier } from './training';

// Setup Offline Evaluation and Confusion Matrix
export const batchMLP = batchPrediction('batch-results-poses', store);
export const confMat = confusionMatrix(batchMLP);

const predictButton = button('Update predictions');
predictButton.$click.subscribe(async () => {
  if (!classifier.ready) {
    throwError(new Error('No classifier has been trained'));
  }
  await batchMLP.clear();
  await batchMLP.predict(
    classifier,
    trainingSet.items().map(({ x, y, id }) => ({ x: postprocess(x), y, id })),
  );
});

// Create a filtered dataset for data corresponding to squares of the confusion matrix
const $confMatFilter = confMat.$selected
  .filter((x) => !!x)
  .map(({ x: yPred, y: yTrue }) =>
    batchMLP.items().query({ label: yPred, yTrue }).select(['instanceId']).toArray(),
  )
  .awaitPromises()
  .map((preds) => preds.map(({ instanceId }) => instanceId))
  .merge(confMat.$selected.filter((x) => !x).map(() => []))
  .map((ids) => ({ id: { $in: ids } }));

const confusionDataset = dataset('training-set-poses', store);
confusionDataset.sift({ id: { $in: [] } });
export const confusionDatasetBrowser = datasetBrowser(confusionDataset);
confusionDatasetBrowser.title = 'Inspect Errors';

// Add a text hint...
const inspectHint = text('Click on the confusion matrix to inspect errors');
inspectHint.title = 'Hint';
confMat.$selected
  .map((z) => {
    if (z) {
      if (z.x === z.y) {
        return `Inspecting instances labeled <strong>${z.y}</strong> and correctly predicted`;
      }

      return `Inspecting instances labeled <strong>${z.y}</strong> but predicted <strong>${z.x}</strong>`;
    }
    return 'Click on the confusion matrix to inspect errors';
  })
  .subscribe((msg) => {
    inspectHint.$value.set(msg);
  });

$confMatFilter.subscribe(confusionDataset.sift);

export function setupPage(dashboard) {
  dashboard
    .page('Inspect Confusions')
    .sidebar(predictButton, confMat)
    .use(inspectHint, confusionDatasetBrowser);
}
