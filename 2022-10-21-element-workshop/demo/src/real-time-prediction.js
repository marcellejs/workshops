import { confidencePlot, throwError, toggle } from '@marcellejs/core';
import { featureExtractor, input, poseViz, postprocess, showSkeleton } from './input';
import { classifier } from './training';

const tog = toggle('toggle prediction');
tog.$checked.subscribe((checked) => {
  if (checked && !classifier.ready) {
    throwError(new Error('No classifier has been trained'));
    setTimeout(() => {
      tog.$checked.set(false);
    }, 500);
  }
});

const predictionStream = input.$images
  .filter(() => tog.$checked.get() && classifier.ready)
  .map(featureExtractor.predict)
  .awaitPromises()
  .filter((x) => x.length > 0)
  .map(postprocess)
  .map(classifier.predict)
  .awaitPromises();

const plotResults = confidencePlot(predictionStream);

export function setupPage(dashboard) {
  dashboard
    .page('Real-time Prediction')
    .sidebar(input, showSkeleton, poseViz)
    .use(tog, plotResults);
}
