uniform float time;
uniform float start;
uniform bool isLeaving;

uniform float noiseSpeed;
uniform float noiseIntensity;
uniform float pointSize;
uniform float animRadius;
uniform float animRotationSpeed;
uniform float durationLeave;

attribute float duration;
vec3 floorPos = vec3(0., -10., 0.); 
attribute float delay;

float linearAnim = 0.;




#define PI 3.14159265358979323846

// Transition function

float quadraticOut(float t) {
  return -t * (t - 2.0);
}

float quadraticIn(float t) {
  return t * t;
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

// Noise

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return (o4.y * d.y + o4.x * (1.0 - d.y)) - 0.5;
}




vec3 hurricane(float anim, vec3 origin, vec3 target){
    float radius;
        
    if( anim < 0.5 ){
        radius = cubicInOut(anim*2.) * animRadius; 
    } else {
        radius = 1. - cubicInOut((anim - 0.5)*2.) * animRadius;
    }

    vec3 pos = origin + (target - origin) * anim;    
    vec3 rotatePos = vec3( cos ( anim * 2. * PI * animRotationSpeed ) * radius, 0., sin( anim * 2. * PI * animRotationSpeed ) * radius );
   
    return pos + rotatePos;
}


void main() {
    vec3 newPosition = position;
    float anim; 

    if (isLeaving) {
        if( time > start + delay ){
            linearAnim = min(1., (time - start - delay)/(delay + durationLeave)); 
        }
        anim = 1. - quadraticIn(linearAnim); 
    } else {
        if( time > start + delay ){
            linearAnim = min(1., (time - start - delay)/(delay + duration)); 
        }
        anim = quadraticOut(linearAnim); 
    }

    if( anim < 1. ){ 
        newPosition = hurricane( anim, floorPos, position ); 
    } 

    newPosition = newPosition + position * noise( vec3( position.xy, position.z + time*noiseSpeed ) ) * (position.y / 15.) * noiseIntensity ;
    
    gl_PointSize = pointSize;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

}