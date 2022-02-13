import pygame

def start():
    pygame.init()

    display = pygame.display.set_mode((0,0),pygame.FULLSCREEN)

    appRunning = True

    while appRunning == True:
        try:
            # TODO: execute game loop
            # TODO: restrict fps

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