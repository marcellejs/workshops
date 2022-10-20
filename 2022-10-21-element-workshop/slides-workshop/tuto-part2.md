---
layout: center
---

# Exploring other workflows

Let's add other visualizations and unsupervised learning!

<!-- We can visualize the dataset using a scatter plot, to offer user a different way to navigate/explore their data. -->

---

# Setting up a ScatterPlot

First, uncomment the following lines in `src/index.js`:

```js
import * as ScatterCluster from './scatter-cluster';

// ...

ScatterCluster.setupPage(dash);
```

Then, open `src/scatter-cluster.js` and add as `datasetScatter` component...

<v-click>

```js {all|1|1-2,5|1,5,11|3,6-8|all}
import { datasetScatter } from '@marcellejs/core';
import { trainingSet } from './data-storage';
import { postprocess } from './input';

const trainingSetScatter = datasetScatter(trainingSet);
trainingSetScatter.setTransforms({
  xy: ({ x }) => postprocess(x).slice(3, 5),
});

export function setupPage(dashboard) {
  dashboard.page('Scatter & Cluster!').use(trainingSetScatter);
}
```

</v-click>

---

# Setting up a ScatterPlot

Result

![scatter step 1](/scatter-step1.png)

---

# A better representation with PCA

The idea

<v-clicks>

1. Create a PCA model (yes, it exists)
2. Create a button
3. Subscribe to the button's `$click` stream to train PCA
4. Add the button to the dashboard, maybe with a progressbar to monitor training
5. Monitor PCA `$training` to change the Scatterplot's transform
6. <twemoji-face-with-spiral-eyes />

</v-clicks>


---

# A better representation with PCA

```js {all|1|10-11|13-15|1,10,18-21|2-8|||}
const projector = pca();
projector.$training
  .filter(({ status }) => status === 'success')
  .subscribe(() => {
    trainingSetScatter.setTransforms({
      xy: (instance) => projector.predict(postprocess(instance.x)).then((res) => res.slice(0, 2)),
    });
  });

const updateProjection = button('Update Projection');
updateProjection.title = 'PCA';

updateProjection.$click.subscribe(async () => {
  projector.train(trainingSet.items().map(({ x }) => ({ x: postprocess(x), y: undefined })));
});

export function setupPage(dashboard) {
  dashboard
    .page('Scatter & Cluster!')
    .sidebar(updateProjection, trainingProgress(projector))
    .use(trainingSetScatter);
}
```

---

![scatter step 2](/scatter-step2.png)

---

# Clustering

Similar process:

- K-Means clustering instead of PCA
- Transform labels instead of coordinates for visualization

---

# Clustering

```js
const clustering = kmeansClustering();
clustering.$training
  .filter(({ status }) => status === 'success')
  .subscribe(() => {
    trainingSetScatter.setTransforms({
      label: (instance) =>
        clustering.predict(postprocess(instance.x)).then(({ cluster }) => cluster),
    });
  });

const updateClutering = button('Update Clutering');
updateClutering.title = 'K-Means Clustering';

updateClutering.$click.subscribe(async () => {
  clustering.train(trainingSet.items().map(({ x }) => ({ x: postprocess(x) })));
});

export function setupPage(dashboard) {
  dashboard
    .page('Scatter & Cluster!')
    .sidebar(updateProjection, progPCA, modelParameters(clustering), updateClutering, progClust)
    .use(trainingSetScatter);
}
```

---

![scatter step 3](/scatter-step3.png)
