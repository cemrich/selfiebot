import VideoSize from './VideoSize.js';

const targetWidth = 480;
const targetHeight = 480;

const videoElement = document.createElement('video');
videoElement.autoplay = true;
videoElement.playsinline = true;
videoElement.addEventListener('canplay', onVideoReady);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = targetWidth;
canvas.height = targetHeight;
canvas.addEventListener('click', takePicture);

(async () => openWebcam())();

async function openWebcam() {
  try {
    const constraints = { 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: { ideal: 'environment' },
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
    targetWidth,
    targetHeight
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
  const data = canvas.toDataURL('image/png');
  const photoElement = document.getElementById('photo');
  photoElement.setAttribute('src', data);

  (async () => sendPicture())();
}

async function sendPicture() {
  const blob = await canvasToBlob(canvas);
  // TODO: use constant for image mime type and quality
  const file = new File([blob], 'picture.png', { type: 'image/png' })
  
  const formData = new FormData();
  formData.append('files[]', file);

  const response = await fetch('/picture', {
    method: 'POST',
    body: formData,
  });

  console.log('respose', response);
}

async function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob == null) {
        reject('Blob could not be created from canvas.');
      } else {
        resolve(blob);
      }
    });
  });
}
