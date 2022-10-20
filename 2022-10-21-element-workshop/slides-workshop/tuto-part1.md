# Getting your hands dirty

Starting from the source code of the previous demo ...

<!-- Source code is hosted on GitHub: [https://github.com/marcellejs/workshops](https://github.com/marcellejs/workshops) -->

- Get the code on your machine

```
git clone https://github.com/marcellejs/workshops.git .
```

- Go to the demo folder

```
cd workshops/demo
```

- Run the demo

```
npm run dev
```

- Open a browser and go to http://localhost:3000 (or change 3000 with the port displayed in the console)

---
layout: image-right
---

# Exploring the code

Opening `src/index.js` in an editor

---

# Adding a _Test Set_

A test set is a dataset whose images are not used for model training

---

Open `src/capture-test-set.js` in an editor

You should see only the creation of a new dashboard page
```js
export function setupPage(dashboard) {
  dashboard.page('Capture Test Set');
}
```
<br />

In `src/index.js` uncomment the following lines:
```js
import * as CaptureTestSet from './capture-test-set';
```
```js
CaptureTestSet.setupPage(dash);
```

---

You should see:

<img src="/images/capture_test-set_empty.png" width='650'>

---

- Add the input data component 

```js
import { input } from './input';
```

<br />

- NB: `input` is defined in `input.js` as:
```js
export const input = webcam();
```

---

- Import the image display

```js
import { input, poseViz } from './input';
```

<br />

- NB: `poseViz` is defined as an `imageDisplay` component in `input.js` as:
```js
const poseViz = imageDisplay(
  input.$images
    .map(async (img) => {
      const result = await featureExtractor.predict(img);
      return featureExtractor.render(img, result);
    })
    .awaitPromises(),
);
```

<!-- ---

- Import the feature extractor

```js {2}
import { webcam, imageDisplay } from '@marcellejs/core';
import { featureExtractor } from './input';

const input = webcam();

const poseViz = imageDisplay(
  input.$images
    .map(async (img) => {
      const result = await featureExtractor.predict(img);
      return featureExtractor.render(img, result);
    })
    .awaitPromises(),
);
``` -->

---

- Import the skeleton selector and add these components

```js {1,4-6}
import { input, poseViz, showSkeleton } from './input';

export function setupPage(dashboard) {
  dashboard
    .page('Capture Test Set')
    .sidebar(input, showSkeleton, poseViz);
}
```

--- 

You should see:

<img src="/images/capture_test-set_webcam.png" width='650'>


--- 

- Add a button to be used to capture the data

```js {2-4}
import { input, poseViz, showSkeleton } from './input';
import { button } from '@marcellejs/core';

const captureTestData = button('Start Recording After Countdown');
```

---

- Declare a new dataset to store the captured data and its visualiser

```js {2,5-6}
import { input, poseViz, showSkeleton } from './input';
import { button, dataset, datasetBrowser } from '@marcellejs/core';

const captureTestData = button('Start Recording After Countdown');
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);
```

---

- Import shared store

```js {3}
import { input, poseViz, showSkeleton } from './input';
import { button, dataset, datasetBrowser } from '@marcellejs/core';
import { store } from './data-storage';

const captureTestData = button('Start Recording After Countdown');
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);
```

---

- As for capturing the training data, we will add a counter to trigger the capture and a text input for the label

```js {2,9-13}
import { input, poseViz, showSkeleton } from './input';
import { button, dataset, datasetBrowser, text, textInput } from '@marcellejs/core';
import { store } from './data-storage';

const captureTestData = button('Start Recording After Countdown');
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);

const counter = text('');
counter.title = 'Recording Status (recording 3 seconds)';

const label = textInput();
label.title = 'Instance label';
```


---

- Add all these to the dashboard

```js {4,5}
export function setupPage(dashboard) {
  dashboard
    .page('Capture Test Set')
    .sidebar(input, showSkeleton, poseViz)
    .use([label, captureTestData, counter], testSetBrowser);
}
```

---

You should get something like this:

<img src="/images/capture_page_testset.png" width='650'>

---

- Setting the counter

```js {2,7-9}
import { input, poseViz, showSkeleton } from './input';
import { button, dataset, datasetBrowser, text, textInput, Stream } from '@marcellejs/core';
import { store } from './data-storage';

...

const $ctlTestData = captureTestData.$click.chain(() =>
  Stream.periodic(1000).withItems(['3', '2', '1', 'start', 'start', 'start', 'stop'])
);
```

---

- Setting the counter

```js {10-12}
import { input, poseViz, showSkeleton } from './input';
import { button, dataset, datasetBrowser, text, textInput, Stream } from '@marcellejs/core';
import { store } from './data-storage';

...

const $ctlTestData = captureTestData.$click.chain(() =>
  Stream.periodic(1000).withItems(['3', '2', '1', 'start', 'start', 'start', 'stop'])
);
$ctlTestData.subscribe((x) =>
  counter.$value.set(`<span style="font-size: 32px">${x}</span>`)
);
```

- Try out by clicking on the capture button

---

- Creating instances

```js {1,7-23}
import { input, poseViz, showSkeleton, featureExtractor } from './input';
import { button, dataset, datasetBrowser, text, textInput, Stream } from '@marcellejs/core';
import { store } from './data-storage';

...

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
```

---

- Adding instances to the test set

```js {25}
import { input, poseViz, showSkeleton, featureExtractor } from './input';
import { button, dataset, datasetBrowser, text, textInput, Stream } from '@marcellejs/core';
import { store } from './data-storage';

...

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
```

---

# So What?

---

- To use the test set outside of the `capture-test-set.js` file, we have to export it:

```js
export const testSet = dataset('test-set-poses', store);
```

---

- In `inspect-confusions.js`, a first edit at `line 26`: 

```js {3}
await batchMLP.predict(
    classifier,
    testSet.items().map(({ x, y, id }) => ({ x: postprocess(x), y, id })),
  );
```

- A second edit at `line 41`: 

```js
const confusionDataset = dataset('test-set-poses', store);
```

--- 

# Changing input? 

Uploading image from the disk instead of capturing images live...

--- 

- Let's edit the `capture-test-set.js` as such:

```js 
import { imageUpload } from '@marcellejs/core';

...

const input = imageUpload();


```