import pygame

FPS = 60

def start():
    pygame.init()

    clock = pygame.time.Clock()
    display = pygame.display.set_mode((0,0),pygame.FULLSCREEN)

    appRunning = True

    while appRunning == True:
        try:
            clock.tick(FPS)
            
            # TODO: execute game loop

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    appRunning = False
                    break
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        pygame.quit()
                        appRunning = False
                        break

        except KeyboardInterrupt:
            pygame.quit()
            break