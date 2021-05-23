import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import Webcam from 'react-webcam';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ReactLoading from 'react-loading';

const URL = 'https://teachablemachine.withgoogle.com/models/-tMtDy8Lr/';

let model, maxPredictions;

const MODEL_URL = URL + 'model.json';
const METADATA_URL = URL + 'metadata.json';

export default function Home() {
  const [noMask, setNoMask] = useState(0);
  const [mask, setMask] = useState(0);
  const [webcamDetect, setWebcamDetect] = useState(false);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef(null);
  const init = async () => {
    model = await tmImage.load(MODEL_URL, METADATA_URL);
    maxPredictions = model.getTotalClasses();
    window.requestAnimationFrame(loop);
    setWebcamDetect(true);
  };
  async function loop() {
    webcamRef?.current?.getScreenshot();
    await predict();
    window.requestAnimationFrame(loop);
  }
  async function predict() {
    const prediction = await model.predict(webcamRef?.current?.canvas);
    setLoading(false);
    for (let i = 0; i < maxPredictions; i++) {
      const value = prediction[i].probability;
      if (prediction[i].className === 'Mask') {
        setMask(value.toFixed(2) * 100);
      } else {
        setNoMask(value.toFixed(2) * 100);
      }
    }
  }
  useEffect(() => {
    setLoading(true);
    if (!webcamDetect) {
      init();
    }
  }, []);
  return (
    <div>
      <div
        className={
          noMask > 70 ? 'background bg-red-400' : 'background bg-green-400'
        }
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored
          className="rounded-md mb-3"
          width="50%"
        />
        {loading ? (
          <ReactLoading type="spin" color="white" height={30} width={30} />
        ) : (
          <>
            <h1 className="text-base w-2/4 flex justify-start">No Mask</h1>
            <ProgressBar
              now={noMask}
              label={`${noMask}%`}
              className="w-2/4 mb-2"
              animated
              variant="danger"
            />
            <h1 className="text-base w-2/4 flex justify-start">Mask</h1>
            <ProgressBar
              now={mask}
              label={`${mask}%`}
              className="w-2/4"
              animated
              variant="success"
            />
          </>
        )}
      </div>
    </div>
  );
}
