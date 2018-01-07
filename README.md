# Pachamama Project
<a href="https://codeclimate.com/github/SolalDR/Pachamama/maintainability"><img src="https://api.codeclimate.com/v1/badges/c25aea305cfb1801374e/maintainability" /></a>

A generative design project which allow to create in a pseudo random way an infinity of differents trees.
It is based on the famous WebGL library, THREE.js

The online demo is available <a target="_blanck" href="https://solaldr.github.io/Pachamama/">here</a>.

<img src="https://raw.githubusercontent.com/SolalDR/Pachamama/master/app/assets/banner.png"/>

## How it works

The generation of a tree is separate in 3 steps
- __Geometry conception__ : Foremost, the structure of the tree is generated : branch inheritance, weight, length, twist...
All this informations allow to create a solid "tree" of Object in a pseudo random way.
- __Compute__ : This step represent the geometry creation. After defined a computing precision, it loop on each branch to create at any position the boundaries of the branch based on its local weight and its direction
- __Assemble__ : When all the vertices are defined, 
	- create BufferGeometry
	- instantiate Shader
	- create the mesh


## Setup

* Execute `npm install`

## Environments

* Development `npm start`
* Production `npm run build`

