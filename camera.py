import pygame
import pygame.camera

class Camera:

    def __init__(self, size):
        pygame.camera.init()

        cameras = pygame.camera.list_cameras()
        self.camera = pygame.camera.Camera(cameras[0], size)

    def start(self):
        self.camera.start()

    def stop(self):
        self.camera.stop()

    def draw(self, targetSurface):
        if not self.camera.query_image():
            return False

        captureSurface = self.camera.get_image()
        captureSurface = pygame.transform.flip(captureSurface, True, False)
        captureSurface = pygame.transform.scale(captureSurface, (targetSurface.get_width(), targetSurface.get_height()))
        targetSurface.blit(captureSurface, (0, 0))

        return True

    def saveImage(self, path, size):
        while not self.camera.query_image():
            pass

        captureSurface = self.camera.get_image()
        captureSurface = pygame.transform.flip(captureSurface, True, False)
        captureSurface = pygame.transform.scale(captureSurface, size)
        pygame.image.save(captureSurface, path)

