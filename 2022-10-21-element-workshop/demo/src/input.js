import { imageDisplay, poseDetection, Stream, toggle, webcam } from '@marcellejs/core';
import { $joints } from './skeleton-configuration';

export const input = webcam();
export const featureExtractor = poseDetection('MoveNet', { runtime: 'tfjs' });

export const postprocess = (poses) => featureExtractor.postprocess(poses, $joints.get());

export const showSkeleton = toggle('Visualize Skeleton');
showSkeleton.title = '';

export const poseViz = imageDisplay(
  showSkeleton.$checked
    .map((v) => (v ? input.$images : Stream.empty()))
    .switchLatest()
    .map(async (img) => {
      const result = await featureExtractor.predict(img);
      return featureExtractor.render(img, result);
    })
    .awaitPromises(),
);
