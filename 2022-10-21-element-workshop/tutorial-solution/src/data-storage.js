import { dataset, datasetBrowser, dataStore } from '@marcellejs/core';

export const store = dataStore('https://element-days-backend.herokuapp.com/');
export const trainingSet = dataset('training-set-poses', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);
