import '@marcellejs/core/dist/marcelle.css';
import { dashboard } from '@marcellejs/core';
import { selectPreset, skeletonImage } from './skeleton-configuration';
import { store, trainingSet } from './data-storage';
import { batchMLP } from './inspect-confusions';
import * as CaptureData from './capture-data';
import * as Training from './training';
import * as RealTimePrediction from './real-time-prediction';
import * as InspectConfusion from './inspect-confusions';
// import * as CaptureTestSet from './capture-test-set';
import * as ScatterCluster from './scatter-cluster';

// This is the main script that defines our application.
// While it would be possible to write the entire app in a single script, it is divided
// into JavaScript modules for readbility.

// The following lines are dedicated to setting up the dashboard, and adding the pages defined
// in each module

const dash = dashboard({
  title: 'Marcelle Example - Dashboard',
  author: 'Marcelle Pirates Crew',
});

CaptureData.setupPage(dash);
Training.setupPage(dash);
RealTimePrediction.setupPage(dash);
InspectConfusion.setupPage(dash);
// CaptureTestSet.setupPage(dash);
ScatterCluster.setupPage(dash);

dash.settings
  .dataStores(store)
  .datasets(trainingSet)
  .models(Training.classifier)
  .predictions(batchMLP)
  .use('MoveNet Configuration', selectPreset, skeletonImage);

dash.show();
