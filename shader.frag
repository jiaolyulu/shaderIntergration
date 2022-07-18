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
float speed=2.0;
float n=2.0;
float smoothsteporiginsize=0.5;
float smoothstepsize=0.65;

float N21 (vec2 p){
	float d = fract(sin(p.x*110.+(8.21-p.y)*331.)*1218.);
    return d;
}

float Noise2D(vec2 uv){
    vec2 st = fract(uv);
    vec2 id = floor(uv);
    st = st*st*(3.0-2.0*st);
    float c=mix(mix(N21(id),N21(id+vec2(1.0,0.0)),st.x),mix(N21(id+vec2(0.0,1.0)),N21(id+vec2(1.0,1.0)),st.x),st.y);
	return c;
}

// Sin + pai/3
float N22 (vec2 p){
	float d = fract(sin(p.x*110.+(8.21-p.y)*331.+1.04)*1218.);
    return d;
}

float Noise22D(vec2 uv){
    vec2 st = fract(uv);
    vec2 id = floor(uv);
    st = st*st*(3.0-2.0*st);
    float c=mix(mix(N22(id),N22(id+vec2(1.0,0.0)),st.x),mix(N22(id+vec2(0.0,1.0)),N22(id+vec2(1.0,1.0)),st.x),st.y);
	return c;
}

// Sin - pai/3
float N23 (vec2 p){
	float d = fract(sin(p.x*110.+(8.21-p.y)*331.-1.04)*1218.);
    return d;
}

float Noise23D(vec2 uv){
    vec2 st = fract(uv);
    vec2 id = floor(uv);
    st = st*st*(3.0-2.0*st);
    float c=mix(mix(N23(id),N23(id+vec2(1.0,0.0)),st.x),mix(N23(id+vec2(0.0,1.0)),N23(id+vec2(1.0,1.0)),st.x),st.y);
	return c;
}


float blob(float x,float y,float fx,float fy,float size){
   float xx = x+abs(u_mouse.x/ u_resolution.x-0.5)*sin(u_time/speed*size+fx)*size*13.;
   float yy = y+abs(u_mouse.x/ u_resolution.x-0.5)*cos(u_time/speed*size+fy)*size*13.;
   float value=xx*xx+yy*yy;
   return min(690.,20.*size/value*(min(15.,u_time)+10.0))/500.;
   //return min(360.,pow(20.0/value,1.0))/30.;
}


void main(void) {
   vec2 position = (gl_FragCoord.xy / u_resolution.xy )-0.5;
   position*=vec2(u_resolution.x/u_resolution.y,1.);
   //位移 
   position+=(Noise2D(position*2.+vec2(pow(u_time/4.0,0.2)))-0.5)/10.;
   //position+=(Noise2D(position*2.+vec2(min(15.,u_time/9))))/10.;
   position*=0.7;
   
   float mouseX=abs(u_mouse.x/ u_resolution.x-0.5);
   float mouseY=abs(u_mouse.y/ u_resolution.y);
   position*=1.0*pow((1.5-mouseX),2.);
   float x = position.x*2.0;
   float y = position.y*2.0;
   
   //大球a1
   float a1=blob(x-0.1,y-0.1,mouseX*1.+2.,1.9-mouseX,0.7);
   
   //小球a4
   float a4=blob(x+0.5,y+0.5,mouseX*1.+2.,1.9-mouseX,0.3);
   
   //缠绕四球a
   float a =  
   blob(x,y,mouseX*1.+3.,1.9,0.6) + 
   blob(x-0.2,y-0.1,1.,0.9,0.7) +
   blob(x+0.1,y+0.1,-mouseX*0.8+1.,1.9-1.4*mouseX,0.8) + 
   blob(x,y,2.,1.9,0.5); 
   a=a/4.;
   
   //摆动三球a2
   float a2= blob(x+0.1*sin(u_time/speed),y+0.02,-mouseX*0.4+1.,1.9,0.8)
   +blob(x-0.2*sin(u_time/speed),y-0.02,-mouseX*0.2+1.5,1.9,0.66)
   +blob(x+0.3*sin(u_time/speed-0.3),y+0.01,-mouseX*0.4+1.,0.9,0.7);
   a2=a2/3. ;
   
   //混沌五球a3
   float a3= blob(x+2.*sin(u_time/speed),y-1.,-mouseX*0.4+1.,1.9,0.8)
   +blob(x+0.3*sin(u_time/speed),y-0.5,-mouseX*0.2+1.5,1.9,0.66)
   +blob(x+0.5*sin(u_time/speed),y+0.4,-mouseX*0.4+1.,0.9,0.4)
   +blob(x,y,2.,1.9,0.5); 
   a3=a3/3.;
   
   //white ball
   float white = blob(x,y,1.-mouseX*1.,0.9-1.3*mouseX,u_time*0.7);
   float white2 = blob(x,y,mouseX*1.-0.5,1.*mouseX-0.9,1.7);
   
   float border=smoothstep(0.2,0.65,a);
   float border1=smoothstep(0.2,0.65,a1);
   float border2=smoothstep(0.2,0.65,a2);
   float border3=smoothstep(0.2,0.65,a3);
   float border4=smoothstep(0.2,0.65,a4);
   //vec3 originABC= vec3(a*1.2,border*Noise2D(position*1.+vec2(mouseX/1.))*0.6,border*Noise2D(position*1.+vec2(mouseX/1.))*0.4);
   //vec3 originABC= vec3(a,border*Noise2D(position*1.+vec2(u_time/1.)),0.);

   float alpha2=1.0;
   float alpha3=1.0;
   float alpha1=1.0;
   float alpha=1.0;
   float alpha4=0.0;

   vec4 originABC= vec4(0.);
   
   vec4 originColor=originABC;
   
   originColor = mix(originColor,vec4(0.2*border2*Noise22D(position*1.+vec2(u_time/speed)),0.8*border2*Noise2D(position*1.+vec2(u_time/speed)),0.,alpha2),a3*0.7);//黄色
   originColor = mix(originColor,vec4(1.*border3*Noise2D(position*1.+vec2(u_time/speed)),0.,0.3*border1*Noise23D(position*1.+vec2(u_time/speed)),alpha3),a2*0.9);//蓝紫
   //originColor = mix(originColor,vec4(border1*Noise2D(position*1.+vec2(u_time/speed)),0.3*border1*Noise22D(position*1.+vec2(u_time/speed)),0.,alpha1),a1);//橙色
   //originColor = mix(originColor,vec4(0.2*border*Noise23D(position*1.+vec2(u_time/speed)),0.2*border*Noise2D(position*1.+vec2(u_time/speed)),0.8*border*Noise2D(position*1.+vec2(u_time/speed)),alpha),a2*0.5);//青色
   //originColor = mix(originColor,vec4(border4*Noise22D(position*1.+vec2(u_time/speed)),0.3*border4*Noise22D(position*1.+vec2(u_time/speed)),0.,alpha4),a4);//橙色
   
   originColor=min(vec4(1.),originColor);
   originColor=max(vec4(0.),originColor);
   vec4 d = originColor;
   d=min(vec4(1.),d);
   d=max(vec4(0.,0.,0.,0.0),d);


   gl_FragColor = 1.0-d;
}