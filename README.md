# Background #
Standing Menacingly is my take on Punchout!! for the Nintendo Entertainment System. It blends elements from Japanese pop culture icons such as Jojo's Bizarre Adventure to bring a creative spin on the classic game by allowing the user to play with their voice. 

The original game is simple and contains two objects as it's main focus - the player and their opponent. The player must punch an opponent boxer and knock them out as quickly as possible.

# [Standing Menacingly](https://echin522.github.io/Standing-Menacingly/) #

## Instructions ##
### Loading In ###
    Click anywhere on the initial loading screen. 
### Menus ###
    Click anywhere on the player to register three words
    To retry, just click the button on the bottom right of the menu
    To proceed, click the button the bottom left of the menu
    The following menu contains simple difficulty settings that the player can adjust using the given sliders
### Gameplay ###
    After the game begins, the player will say any of the three words they registered into the microphone
    Each valid word they say will deal damage to the enemy
    Damage dealt per round is deteremined by the length and number of times a word has been said
    The objective is to simply knockout the opponent within the time limit
​
## Technologies, Libraries, and API's ##
​
- Animations were obtained from open source site [Mixamo](https://www.mixamo.com/#/) 
- Models have been rigged using [Blender]() and [Sketchfab](https://sketchfab.com/tags/blender)
- Models and environment will be created using the [Three.js](https://threejs.org/) API
- Audio input will be processed using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
- Misc: webpack and npm
​
​
## Implementation ##
​
Models are loaded in with a factory style assembly line. Each unique model shares the same animations with each other, making it fairly straightforward to load the same punches and hitstun animations. From there, it's a matter of choosing where to load them and what directions they are to face.
​
```
function loadAnimation(model, anim, startPos, rotation, scale, add, once) {
    loader.load(`${model}/${anim}.gltf`, function (gltf) {
        let newAnim = gltf.scene;
        newAnim.name = `${model}_${anim}`;
        newAnim.scale.setScalar(scale);