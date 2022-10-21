import { input, poseViz, showSkeleton, featureExtractor } from './input';
import { button, dataset, datasetBrowser, text, textInput, Stream } from '@marcellejs/core';
import { store } from './data-storage';


const captureTestData = button('Start Recording After Countdown');
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);

const counter = text('');
counter.title = 'Recording Status (recording 3 seconds)';

const label = textInput();
label.title = 'Instance label';
const $ctlTestData = captureTestData.$click.chain(() =>
  Stream.periodic(1000).withItems(['3', '2', '1', 'start', 'start', 'start', 'stop'])
);
$ctlTestData.subscribe((x) =>
  counter.$value.set(`<span style="font-size: 32px">${x}</span>`)
);

const $instancesTest = $ctlTestData
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

$instancesTest.subscribe(testSet.create);

export function setupPage(dashboard) {
  dashboard
    .page('Capture Test Set')
    .sidebar(input, showSkeleton, poseViz)
    .use([label, captureTestData, counter], testSetBrowser);
}
