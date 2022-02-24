const targetWidth = 300;
const targetHeight = 300;

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
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = cameraStream;
  } catch (error) {
    console.error(error);
  }
}

function onVideoReady() {
  // mirror image  for selfies
  context.translate(targetWidth, 0);
  context.scale(-1, 1);

  update();
}

function update() {
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  // scale to correct height and crop sides
  const uncroppedTargetWidth = targetWidth * (videoWidth / videoHeight) * (targetHeight / targetWidth);
  const horizontalOffset = (uncroppedTargetWidth - targetWidth) / 2;

  // draw
  context.drawImage(videoElement, -horizontalOffset, 0, uncroppedTargetWidth, canvas.height);
  
  // update loop
  requestAnimationFrame(update);
}

function takePicture() {
  const data = canvas.toDataURL('image/png');
  const photoElement = document.getElementById('photo');
  photoElement.setAttribute('src', data);
}
