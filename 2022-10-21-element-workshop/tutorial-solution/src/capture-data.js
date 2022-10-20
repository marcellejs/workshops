import { button, Stream, text, textInput } from '@marcellejs/core';
import { trainingSet, trainingSetBrowser } from './data-storage';
import { featureExtractor, input, poseViz, showSkeleton } from './input';

const label = textInput();
label.title = 'Instance label';
const capture = button('Start Recording After Countdown');
capture.title = 'Capture instances to the training set';

const $ctl = capture.$click.chain(() =>
  Stream.periodic(1000).withItems(['3', '2', '1', 'start', 'start', 'start', 'stop']),
);

const counter = text('');
counter.title = 'Recording Status (recording 3 seconds)';
$ctl.subscribe((x) => counter.$value.set(`<span style="font-size: 32px">${x}</span>`));

const $instances = $ctl
  .filter((x) => ['start', 'stop'].includes(x))
  .skipRepeats()
  .map((x) => (x === 'start' ? input.$images : Stream.empty()))
  .switchLatest()
  .map(async (img) => {
    const result = await featureExtractor.predict(img);
    const thumbnail = featureExtractor.thumbnail(img, result);
    return {
      x: result,
      y: label.$value.get(),
      // raw_image: img,
      thumbnail,
    };
  })
  .awaitPromises();

$instances.subscribe(trainingSet.create);

export function setupPage(dashboard) {
  dashboard
    .page('Capture Data')
    .sidebar(input, showSkeleton, poseViz)
    .use([label, capture, counter], trainingSetBrowser);
}
