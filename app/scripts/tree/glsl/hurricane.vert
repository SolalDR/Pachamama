uniform float time; 
attribute float animation; 
attribute vec3 floorPos; 
attribute float animationStart;

#define PI 3.14159265358979323846

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

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

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
    gl_PointSize = 1.5;

    float linearAnim = 0.;
    if( time > animationStart ){
        linearAnim = min(1., (time - animationStart)/(animationStart+animation)); 
    }
    
    float anim = cubicOut(linearAnim); 
    float radius;


    if( anim < 0.5 ){
        radius = cubicInOut(anim*2.) * 2.; 
    } else {
        radius = 1. - cubicInOut((anim - 0.5)*2.) * 2.;
    }

    vec3 newPosition;

    
    vec3 trans = floorPos + (position - floorPos) * anim;
    vec3 local = vec3( trans.x + cos(anim*6.*PI)*radius, trans.y, trans.z + sin(anim*2.*PI)*radius );
    

    local = vec3( cos(linearAnim*2.*PI * 5.) * radius, 0, sin(linearAnim*2.*PI * 5.) * radius);


    newPosition = local + trans;
    newPosition = newPosition + position * noise( vec3(position.xy, position.z + time/1000. ) ) * 0.1;
    



	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

}