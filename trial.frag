#ifdef GL_ES
precision mediump float;
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution; 
uniform float u_time;

uniform vec2 u_mouse;
void main(void) {
   vec2 position = gl_FragCoord.xy/u_resolution.xy-0.5;
   position*=vec2(u_resolution.x/u_resolution.y,1.);

float mouseX=abs(u_mouse.x/ u_resolution.x-0.5);

   gl_FragColor = vec4(mouseX,0.,0.,1.);
}