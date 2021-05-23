// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

import { useState } from 'react';

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/6KTJV-4AM/';

let model, webcam, labelContainer, maxPredictions;

let prediction;

// Load the image model and setup the webcam
export async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById('webcam-container').appendChild(webcam.canvas);
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  prediction = await model.predict(webcam.canvas);
}
