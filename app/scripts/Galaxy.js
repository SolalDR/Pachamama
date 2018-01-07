var vertex = `
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float time;

//'blueprint' attribute
attribute vec3 position;

//instance attributes
attribute vec3 translation;
attribute vec4 rotation;
attribute vec3 scale;

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

// transforms the 'blueprint' geometry with instance attributes
vec3 transform( inout vec3 position, vec3 T, vec4 R, vec3 S ) {
    //applies the scale
    position *= S;
    //computes the rotation where R is a (vec4) quaternion
    position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
    //translates the transformed 'blueprint'
    position += T;
    //return the transformed position
    return position;
}

//re-use position for shading
varying vec3 vPos;

#define PI 3.14159265358979323846

void main() {
    //collects the 'blueprint' coordinates
    vec3 pos = position;
    vec3 trans = translation;


    vec4 rot = rotation;
    // rot.x: = 2.*PI*noise(vec3(rotation.xy, rotation.z + time/1000.));
    
    trans.x = (noise(vec3(trans.x+time/10000000., trans.yz)) - 0.5) * 100.;
    trans.y = (noise(vec3(trans.x, trans.y+time/10000000., trans.z)) - 0.5) * 100.;
    trans.z = (noise(vec3(trans.xy, trans.z+time/10000000.)) - 0.5) * 100.;
    
    

    //transform it
    transform( pos, trans, rot, scale );
    //project to get the fragment position
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    //just to render something :)
    vPos = pos;
}
`;

var fragment = `
precision highp float;
varying vec3 vPos;
void main() {
    //normalize( vPos )
    gl_FragColor = vec4( 0., 0., 0., .5 );
}
`;

class Galaxy {

    constructor( ) {
        this.config = {
            limit: {
                min: 10,
                max: 50
            },
            scale: 1,
        }
        this.mesh = this.getInstances( 100 );        
    }


    getInstances( count ){

        //creates an instancedBufferGeometry
        var geometry = new THREE.InstancedBufferGeometry();

        //a vertex buffer for the 'blueprint' representing a single triangle
        var blueprint = [];
        for ( var i = 0; i < 3; i++){
            var a = Math.PI / 3 * i;
            blueprint.push( Math.cos( a ), Math.sin( a ), 0 );
        }

        //assign the positions as a 'regular' BufferAttribute
        var attribute = new THREE.BufferAttribute( new Float32Array( blueprint ), 3);
        geometry.addAttribute( 'position', attribute );

        //and that's it for the 'blueprint' ; all instances will share these data
        //we can add more ; normals and uvs are very often used to shade the mesh.

        //now for the InstancedBufferAttributes, what makes each instance different.

        //we create some float buffers to store the properties of each instance
        var translation = new Float32Array( count * 3 );
        var rotation = new Float32Array( count * 4 );
        var scale = new Float32Array( count * 3 );

        //and iterators for convenience :)
        var translationIterator = 0;
        var rotationIterator = 0;
        var scaleIterator = 0;

        //and a temp quaternion (rotations are represented by Quaternions, not Eulers)
        var q = new THREE.Quaternion();

        //now let's feed some random values to transform the instances
        for ( i = 0; i < count; i++ ){

            //a random position
            translation[ translationIterator++ ] = this.config.limit.min + ( Math.random() - .5 ) * (this.config.limit.max - this.config.limit.min);
            translation[ translationIterator++ ] = this.config.limit.min + ( Math.random() - .5 ) * (this.config.limit.max - this.config.limit.min);
            translation[ translationIterator++ ] = this.config.limit.min + ( Math.random() - .5 ) * (this.config.limit.max - this.config.limit.min);

            //a random rotation

            //randomize quaternion not sure if it's how you do it but it looks random
            q.set(  ( Math.random() - .5 ) * 2,
                    ( Math.random() - .5 ) * 2,
                    ( Math.random() - .5 ) * 2,
                    Math.random() * Math.PI );
            q.normalize();

            //assign to bufferAttribute
            rotation[ rotationIterator++ ] = q.x;
            rotation[ rotationIterator++ ] = q.y;
            rotation[ rotationIterator++ ] = q.z;
            rotation[ rotationIterator++ ] = q.w;

            //a random scale
            scale[ scaleIterator++ ] = 0.1 + ( Math.random() * this.config.scale );
            scale[ scaleIterator++ ] = 0.1 + ( Math.random() * this.config.scale );
            scale[ scaleIterator++ ] = 0.1 + ( Math.random() * this.config.scale );

        }

        //create the InstancedBufferAttributes from our float buffers
        geometry.addAttribute( 'translation', new THREE.InstancedBufferAttribute( translation, 3, 1 ) );
        geometry.addAttribute( 'rotation', new THREE.InstancedBufferAttribute( rotation, 4, 1 ) );
        geometry.addAttribute( 'scale', new THREE.InstancedBufferAttribute( scale, 3, 1 ) );

        // create a material
        this.material = new THREE.RawShaderMaterial( {
            uniforms: { time: { type: "f", value: 0 } },
            vertexShader: vertex,
            fragmentShader: fragment,
            side:THREE.DoubleSide,
            transparent: true
        } );

        return new THREE.Mesh( geometry, this.material );

    }

    render(time) {
        this.material.uniforms.time.value = time;
        this.material.uniforms.needsUpdate = true;
    }
}

export default Galaxy;


