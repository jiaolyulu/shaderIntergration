
var canvas1 = document.getElementById("lulu");
console.log(canvas1);
var sandbox = new GlslCanvas(canvas1);


document.addEventListener("mousemove", event => {
    //console.log(event.clientX,event.clientY);
    sandbox.setUniform("mousePos",event.clientX,event.clientY);
  });

window.onresize = function(event) {
    //console.log(window.innerWidth,window.innerHeight);
   sandbox.setUniform("u_resolution",window.innerWidth,window.innerHeight);
};