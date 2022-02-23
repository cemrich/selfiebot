(async () => { start() })()

async function start () {
  const videoElement = document.getElementById('webcam')

  videoElement.addEventListener('click', function () {
    takePicture(videoElement)
  })

  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoElement.srcObject = cameraStream
  } catch (error) {
    console.error(error)
  }
}

function takePicture (videoElement) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 300
  canvas.height = 300
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

  const data = canvas.toDataURL('image/png')
  const photoElement = document.getElementById('photo')
  photoElement.setAttribute('src', data)
}
