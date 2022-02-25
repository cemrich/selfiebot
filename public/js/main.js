import VideoSize from './VideoSize.js';
import config from './config.js'

const videoElement = document.createElement('video');
videoElement.autoplay = true;
videoElement.playsinline = true;
videoElement.addEventListener('canplay', onVideoReady);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = config.imageWidth;
canvas.height = config.imageHeight;
canvas.addEventListener('click', takePicture);

(async () => openWebcam())();

async function openWebcam() {
  try {
    const constraints = { 
      video: { 
        width: { ideal: config.idealWebcamWidth },
        height: { ideal: config.idealWebcamHeight },
        facingMode: { ideal: config.idealWebcamFacingMode },
      }
    };
    const cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = cameraStream;
  } catch (error) {
    console.error(error);
  }
}

function onVideoReady() {
  const videoSize = new VideoSize(
    videoElement.videoWidth, 
    videoElement.videoHeight,
    config.imageWidth,
    config.imageHeight
  );

  update(videoSize);
}

function update(videoSize) {
  // draw
  context.drawImage(
    videoElement, 
    videoSize.horizontalOffset, 
    videoSize.verticalOffset, 
    videoSize.uncroppedTargetWidth, 
    videoSize.uncroppedTargetHeight
  );
  
  // update loop
  requestAnimationFrame(() => update(videoSize));
}

function takePicture() {
  const data = canvas.toDataURL(config.imageMimeType, config.imageQuality);
  const photoElement = document.getElementById('photo');
  photoElement.setAttribute('src', data);

  (async () => sendPicture())();
}

async function sendPicture() {
  const blob = await canvasToBlob(canvas, config.imageMimeType, config.imageQuality);
  const file = new File([blob], 'picture.dat', { type: config.imageMimeType })
  
  const formData = new FormData();
  formData.append('files[]', file);

  const response = await fetch('/picture', {
    method: 'POST',
    body: formData,
  });

  console.log('respose', response);
}

async function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob == null) {
        reject('Blob could not be created from canvas.');
      } else {
        resolve(blob);
      }
    }, mimeType, quality);
  });
}
