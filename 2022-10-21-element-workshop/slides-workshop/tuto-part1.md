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

Opening `index.js` in an editor

---

# Adding a _Test Set_

A test set is a dataset whose images are not used for model training

Open `src/capture-test-set.js` in an editor

---

Create a new page in the dashboard to capture the data

```js
dash.page('Capture Test Set').sidebar(input, showSkeleton, poseViz);
```

---

Create a new page in the dashboard to capture the data by editing the code of the `setup()` function

```js
dashboard.page('Capture Test Set').sidebar(input, showSkeleton, poseViz);
```

Add the components to the scripts by adding on top of the file

```js
import { input, showSkeleton, poseViz } from './inputs';
```

---

Declare a new button to be used to capture the data

```js
const captureTestData = button('Start Recording After Countdown');
```

---

Declare a new button to be used to capture the data

```js
const captureTestData = button('Start Recording After Countdown');
```

Declare a new dataset to store the captured data and its visualiser

```js
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);
```

---

Declare a new button to be used to capture the data

```js
const captureTestData = button('Start Recording After Countdown');
```

Declare a new dataset to store the captured data and its visualiser

```js
const testSet = dataset('test-set-poses', store);
const testSetBrowser = datasetBrowser(testSet);
```

Add these elements on the dashboard's page `Capture Test Set`, together with label and counter components already used to capture training data:

```js {4}
dash
  .page('Capture Test Set')
  .sidebar(input, showSkeleton, poseViz2)
  .use([label, captureTestData, counter], testSetBrowser);
```

---

You should get something like this:

<img src="/images/capture_page_testset.png" width='650'>

---

Setting the counter

```js
const $ctlTestData = captureTestData.$click.chain(() =>
  Stream.periodic(1000).withItems([
    '3',
    '2',
    '1',
    'start',
    'start',
    'start',
    'stop',
  ])
);
```

```js
$ctlTestData.subscribe((x) =>
  counter.$value.set(`<span style="font-size: 32px">${x}</span>`)
);
```

---

Creating instances

```js
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
