import pygame
from camera import Camera

FPS = 30
CAMERA_SIZE=(1280, 720)

def start():
    pygame.init()

    clock = pygame.time.Clock()
    display = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)

    camera = Camera(CAMERA_SIZE)
    camera.start()

    appRunning = True

    # main loop
    while appRunning == True:
        try:
            clock.tick(FPS)

            # draw camera image
            hasDrawn = camera.draw(display)
            
            # update screen when needed
            if hasDrawn:
                pygame.display.flip()

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    appRunning = False
                    break
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        appRunning = False
                        break
                        
                if event.type == pygame.MOUSEBUTTONDOWN:
                    camera.saveImage()

        except KeyboardInterrupt:
            appRunning = False
            break

    camera.stop()
    pygame.quit()