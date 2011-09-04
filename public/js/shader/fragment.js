#ifdef GL_ES
precision highp float;
#endif

struct Sphere
{
    vec3 position;
    float radius;
    vec4 color;
};

struct Ray {
    vec3 ori;
    vec3 dir;  
};

struct Light
{
    vec3 position;
    vec4 color;
};



bool intersect(in Ray ray,in Sphere sphere,inout float t)
{
    //Compute A, B and C coefficients
    float a = dot(ray.dir, ray.dir);
    float b = 2.0 * dot(ray.dir, ray.ori - sphere.position);
    float c = dot(ray.ori - sphere.position, ray.ori - sphere.position) - (sphere.radius * sphere.radius);

    //Find discriminant
    float disc = b * b - 4.0 * a * c;
    
    // if discriminant is negative there are no real roots, so return 
    // false as ray misses sphere
    if (disc < 0.0)
        return false;

    // compute q as described above
    float distSqrt = sqrt(disc);
    float q;
    if (b < 0.0)
        q = (-b - distSqrt)/2.0;
    else
        q = (-b + distSqrt)/2.0;

    // compute t0 and t1
    float t0 = q / a;
    float t1 = c / q;

    // make sure t0 is smaller than t1
    if (t0 > t1)
    {
        // if t0 is bigger than t1 swap them around
        float temp = t0;
        t0 = t1;
        t1 = temp;
    }

    // if t1 is less than zero, the object is in the ray's negative direction
    // and consequently the ray misses the sphere
    if (t1 < 0.0)
        return false;

    // if t0 is less than zero, the intersection point is at t1
    if (t0 < 0.0)
    {
        t = t1;
        return true;
    }
    // else the intersection point is at t0
    else
    {
        t = t0;
        return true;
    }
}

vec3 sphereNormal(in vec3 position, in Sphere sphere)
{
    return normalize(position-sphere.position);
}


void main(void) {
    float width = 800.0;
    float height = 600.0;
    
    float PI = 3.14159265358979323846264;
    float fovx = PI*0.3;
    float fovy = height/width*fovx;
    
    
    float u = gl_FragCoord.x;
    float v = gl_FragCoord.y;
    
    float x = (2.0*u-width)/width*tan(fovx);
    float y = (2.0*v-height)/height*tan(fovy);
    //spheres[0].position = vec3(30,30,0);
    //spheres[0].radius = 5;

    Ray ray = Ray(vec3(0,0,0),vec3(x,y,1));
    

    Sphere spheres[2];
    spheres[1] = Sphere(vec3(0.0,0.0,3.0),1.0,vec4(0.8,0.0,0.2,1));
    spheres[0] = Sphere(vec3(2.0,0.0,3.0),1.0,vec4(0.0,0.1,0.6,1));
        
    Light lights[1];
    lights[0] = Light(vec3(0.0,10.0,-20.0),vec4(1.0,1.0,1.0,1.0));
    
    bool hit = false;
 
    gl_FragColor = vec4(0,0,0,1);
    
    float mult = 1.0;
    for(int n=0; n<10; n++)
    {
    
        bool hitThis = false;
        float t = 1000000000.0;
        Sphere hitSphere;
        for(int i=0; i<2; i++)
        {
            float tempT = 0.0;
            if(intersect(ray,spheres[i],tempT) == true)
            {
                if(tempT <= t)
                {
                    hitThis = true;
                    hit = true;  
                    t = tempT;
                    hitSphere = spheres[i];
                }
            }
        }
        if(!hitThis)
        {
            break; //No hit, no more traced rays
        }
            
        float roulette = fract(sin(gl_FragCoord.x * 12.9898
            + gl_FragCoord.y * 78.233) * 43758.5453);
        
        vec3 intersectionPoint = ray.ori + ray.dir*t;
        vec3 normal = sphereNormal(intersectionPoint,hitSphere);
        
        //if(roulette <= 0.2 ) 
        {
            //reflect
            ray.dir = ray.dir - 2.0 * normal * dot( normal, ray.dir );
            ray.ori = intersectionPoint+normalize(ray.dir)*0.0001;
        }
        //else
        {
            //diffuse
            
            
            
            vec3 lightRay = lights[0].position - intersectionPoint;
            lightRay = normalize(lightRay);
            
            float dotProduct = dot( normal, lightRay );
            if (dotProduct > 0.0)
            {
                float diff = dotProduct * 0.9;
            
                // add diffuse component to ray color
                gl_FragColor += mult * diff * hitSphere.color * lights[0].color;
                mult *= diff;
            }
            //break;
        }
    }
    
    if(!hit)
    {
        gl_FragColor = vec4(0,0,0,0);
    }

}