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
    // TODO: use better webcam quality
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
  // TODO: move calculations out on update toop to onVideoReady
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
