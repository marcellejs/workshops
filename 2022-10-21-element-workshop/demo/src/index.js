import '@marcellejs/core/dist/marcelle.css';
import {
  batchPrediction,
  datasetBrowser,
  button,
  confusionMatrix,
  dashboard,
  dataset,
  dataStore,
  mlpClassifier,
  modelParameters,
  confidencePlot,
  trainingProgress,
  textInput,
  toggle,
  trainingPlot,
  poseDetection,
  throwError,
  webcam,
  Stream,
  text,
  imageDisplay,
} from '@marcellejs/core';
import { $joints, selectPreset, skeletonImage } from './configuration';

// -----------------------------------------------------------
// INPUT PIPELINE & DATA CAPTURE
// -----------------------------------------------------------

const input = webcam();
const featureExtractor = poseDetection('MoveNet', { runtime: 'tfjs' });

const postprocess = (poses) => featureExtractor.postprocess(poses, $joints.get());

const showSkeleton = toggle('Visualize Skeleton');
showSkeleton.title = '';

const poseViz = imageDisplay(
  showSkeleton.$checked
    .map((v) => (v ? input.$images : Stream.empty()))
    .switchLatest()
    .map(async (img) => {
      const result = await featureExtractor.predict(img);
      return featureExtractor.render(img, result);
    })
    .awaitPromises(),
);

const label = textInput();
label.title = 'Instance label';
const capture = button('Start Recording After Countdown');
capture.title = 'Capture instances to the training set';

const store = dataStore('localStorage');
const trainingSet = dataset('training-set-poses', store);
const trainingSetBrowser = datasetBrowser(trainingSet);

const $ctl = capture.$click.chain(() =>
  Stream.periodic(1000).withItems(['3', '2', '1', 'start', 'start', 'start', 'stop']),
);
const counter = text('');
counter.title = 'Recording Status (recording 3 seconds)';
$ctl.subscribe((x) => counter.$value.set(`<span style="font-size: 32px">${x}</span>`));

const $instances = $ctl
  .filter((x) => ['start', 'stop'].includes(x))
  .skipRepeats()
  .map((x) => (x === 'start' ? 1 : 0))
  .map((record) => (record ? input.$images : Stream.empty()))
  .switchLatest()
  .map(async (img) => {
    const result = await featureExtractor.predict(img);
    const thumbnail = featureExtractor.thumbnail(img, result);
    return {
      x: result,
      y: label.$value.get(),
      raw_image: img,
      thumbnail,
    };
  })
  .awaitPromises();

$instances.subscribe(trainingSet.create);

// -----------------------------------------------------------
// TRAINING
// -----------------------------------------------------------

const b = button('Train');
b.title = 'Training Launcher';
const classifier = mlpClassifier().sync(store, 'mlp-dashboard');

b.$click.subscribe(() =>
  classifier.train(trainingSet.items().map(({ x, y }) => ({ x: postprocess(x), y }))),
);

const params = modelParameters(classifier);
const prog = trainingProgress(classifier);
const plotTraining = trainingPlot(classifier);

// -----------------------------------------------------------
// BATCH PREDICTION
// -----------------------------------------------------------

const batchMLP = batchPrediction('batch-results-poses', store);
const confMat = confusionMatrix(batchMLP);

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

const $confMatFilter = confMat.$selected
  .filter((x) => !!x)
  .map(({ x: yPred, y: yTrue }) =>
    batchMLP.items().query({ label: yPred, yTrue }).select(['instanceId']).toArray(),
  )
  .awaitPromises()
  .map((preds) => preds.map(({ instanceId }) => instanceId))
  .merge(confMat.$selected.filter((x) => !x).map(() => []))
  .map((ids) => ({ id: { $in: ids } }));

const inspectHint = text('Click on the confusion matrix to inspect errors');
inspectHint.title = 'Hint';
const confusionDataset = dataset('training-set-poses', store);
confusionDataset.sift({ id: { $in: [] } });
export const confusionDatasetBrowser = datasetBrowser(confusionDataset);
confusionDatasetBrowser.title = 'Inspect Errors';

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

$confMatFilter.subscribe(console.log);
$confMatFilter.subscribe(confusionDataset.sift);

// -----------------------------------------------------------
// REAL-TIME PREDICTION
// -----------------------------------------------------------

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

// -----------------------------------------------------------
// DASHBOARDS
// -----------------------------------------------------------

const dash = dashboard({
  title: 'Marcelle Example - Dashboard',
  author: 'Marcelle Pirates Crew',
});

dash
  .page('Capture Data')
  .sidebar(input, showSkeleton, poseViz)
  .use([label, capture, counter], trainingSetBrowser);
dash.page('Train Model').use(params, b, prog, plotTraining);
dash.page('Real-time Prediction').sidebar(input, showSkeleton, poseViz).use(tog, plotResults);
dash.settings
  .dataStores(store)
  .datasets(trainingSet)
  .models(classifier)
  .predictions(batchMLP)
  .use('MoveNet Configuration', selectPreset, skeletonImage);
dash
  .page('Inspect Confusions')
  .sidebar(predictButton, confMat)
  .use(inspectHint, confusionDatasetBrowser);

dash.show();
