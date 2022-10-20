import { dataset, datasetBrowser, dataStore } from '@marcellejs/core';

export const store = dataStore('localStorage');
export const trainingSet = dataset('training-set-poses', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);
