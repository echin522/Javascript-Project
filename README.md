# Background #

Standing Menacingly (tentative) is my take on Punchout!! for the Nintendo Entertainment System. It blends elements from Japanese pop culture icons such as Jojo's Bizarre Adventure to bring a creative spin on the classic game by allowing the user to play with their voice. 

The original game is simple and contains two objects as it's main focus - the player and their opponent. The player must punch an opponent boxer and knock them out as quickly as possible.


# Link to Live Version #




# Wireframe #

![Wireframe](/edgar-chin-project/images/wireframe.png)

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
