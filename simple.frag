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
float speed=1.;
float n=2.0;

float blob(float x,float y,float fx,float fy,float size){
   float xx = x+abs(u_mouse.x/ u_resolution.x-0.5)*sin(u_time/speed*size+fx)*size*7.*(1.-abs(u_mouse.x/ u_resolution.x-0.5));
   float yy = y+abs(u_mouse.x/ u_resolution.x-0.5)*cos(u_time/speed*size+fy)*size*7.*(1.-abs(u_mouse.x/ u_resolution.x-0.5));
   float value=sqrt(xx*xx+yy*yy);

   return min(60.,20.0/value);
}

// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
   vec2 position = gl_FragCoord.xy/u_resolution.xy-0.5;
   position*=vec2(u_resolution.x/u_resolution.y,1.);
   position*=0.7;
   float x = position.x*2.0;
   float y = position.y*2.0;
   float mouseX=abs(u_mouse.x/ u_resolution.x-0.5);
   float a = blob(x,y,mouseX*1.+2.,3.9-mouseX,0.7) + blob(x,y,mouseX*1.+3.,3.9+mouseX,0.6) ;
   float b = blob(x,y,-mouseX*0.8+1.,1.9-1.4*mouseX,0.8) + blob(x,y,mouseX*0.25+2.,2.9-mouseX,0.4);
   float c = blob(x,y,1.-mouseX*1.,4.9-1.3*mouseX,0.5) + blob(x,y,mouseX*1.5+1.4,1.9+2.*mouseX,0.3);
   vec3 originColor=vec3(b*0.8,c,a*(60.-a)/20.)/60.;
   
   
   vec3 d = 1.4-originColor;
   d=min(vec3(1.),d);
   d=max(vec3(0.),d);


   gl_FragColor = vec4(d.x,d.y,d.z,1.0);
}