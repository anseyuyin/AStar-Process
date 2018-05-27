# AStar-Process
The is a Algorithm calculation process Demo of A* (A Star)

Its purpose is to help you understand the A* algorithm quickly and efficiently.

Demo:
https://anseyuyin.github.io/AStar-Process/demo


# Features

* you can watch every step of the calculation process

* pause or replay in any timeline


# Usage
if you want use this code 

aStar.js file path is  /aStar/js/aStar.js

frist load 
````html
<script src="aStar.js"></script>
````
do findPath
````javascript
var astar = new findPath.aStar(); //new aStar object
var outPath = []; //resulte container Array
astar.findPath(1,1,1,8,outPath); //Calculation get path
````
map limit Filter
````javascript
//a temp map
var map = [[1,1,1,1,1,1],
           [1,0,0,0,0,1],
           [1,0,0,0,0,1],
           [1,0,0,0,0,1],
           [1,0,0,0,0,1],
           [1,1,1,1,1,1],]
//set outFilter Filter Function      
astar.outFilter = (x,y)=>{
  return map[y][x] == 0;
}
var outPath = []; //resulte container Array
astar.findPath(1,1,1,8,outPath); //Calculation get path
````
