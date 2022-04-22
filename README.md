# Background #

Standing Menacingly (tentative) is my take on Punchout!! for the Nintendo Entertainment System. It blends elements from Japanese pop culture icons such as Jojo's Bizarre Adventure to bring a creative spin on the classic game by only allowing the user to play with their voice. 

The original game is simple and contains two objects as it's main focus - the player and their opponent. The player must punch an opponent boxer and knock them out as quickly as possible.

There will be four difficulty settings for the opponent, each with different time and health parameters. The user wins if they are able to knock the opponent out within the time limit and loses otherwise. Further details will be shared in the following sections.


# Functionality & MVP #

Game setup
- The user will speak their "punch phrase" (PP) into the microphone
- Upon registering and confirming their desired PP, they may choose a difficulty setting
- The game officially begins once they say their PP again

Core gameplay
- Each time the player calls their PP, it will register as a single punch. Constant screaming will not count!
- Each punch will deal damage to the enemy
- Once the enemy runs out of health, the player wins!
- If the timer runs out before the enemy is KO'd, the player loses

Options (not voice controlled)
- Universal
    - Mute music and/or SFX
    - Instructions sheet (initially hidden)
- Start menu
    - Difficulty setting
- During gameplay
    - Pause menu


# Wireframe #

![Alt text](https://wireframe.cc/sGC4ed "Wireframe")
## Person ##
    Player's character
## Menu ##
    Contains main title and game settings
    Top right corner contains music and SFX toggle buttons and pause/play button
## Faces (disappear during gameplay) ##
    Github, LinkedIn, and About links are positioned in the bottom right corner
## Stars ##
    Costumes for player model


# Technologies, Libraries, and API's #

- Models will be obtained from open-source site [Sketchfab](https://sketchfab.com/tags/blender)
- Models and environment will be created using the [Three.js](https://threejs.org/) API
- Audio input will be processed using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
- Misc: webpack and npm


# Project Timeline #

Friday & Weekend: Setup project and successfully retrieve user audio input. Begin writing basic game logic. Begin researching how to implement the game logic on the character models

Monday: Continue to develop basic game logic and create character models and essential animations. Also start creating the landing page

Tuesday: Complete game development and playtest it using a basic sandbox. Continue to develop landing page

Wednesday: Complete the landing page and iterate on stylesheets. Work on bonuses if time is available.

Thursday: Deploy to Github and refactor this README


# Bonus Features #

Each difficulty setting has its own enemy model and music theme
The user can choose from several available character models
Punch strength is determined by PP loudness
"Fatality" punch cutscene to end a round
