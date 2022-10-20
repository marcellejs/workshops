import {
  button,
  datasetScatter,
  kmeansClustering,
  modelParameters,
  pca,
  trainingProgress,
} from '@marcellejs/core';
import { trainingSet } from './data-storage';
import { postprocess } from './input';

const trainingSetScatter = datasetScatter(trainingSet);
trainingSetScatter.setTransforms({
  xy: ({ x }) => postprocess(x).slice(3, 5),
});

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

const progPCA = trainingProgress(projector);
const progClust = trainingProgress(clustering);

export function setupPage(dashboard) {
  dashboard
    .page('Scatter & Cluster!')
    .sidebar(updateProjection, progPCA, modelParameters(clustering), updateClutering, progClust)
    .use(trainingSetScatter);
}
