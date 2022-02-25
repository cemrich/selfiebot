export default class VideoSize {

  constructor(videoWidth, videoHeight, targetWidth, targetHeight) {
    const targetAspect = targetWidth / targetHeight;
    const videoAspect = videoWidth / videoHeight;

    this.uncroppedTargetWidth = Math.max(targetWidth * videoAspect / targetAspect, targetWidth);
    this.uncroppedTargetHeight = this.uncroppedTargetWidth / videoAspect;
    this.horizontalOffset = -(this.uncroppedTargetWidth - targetWidth) / 2;
    this.verticalOffset = -(this.uncroppedTargetHeight - targetHeight) / 2;
  }

}
