import{P as y}from"./vendor.6c0cdefa.js";const p=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}};p();var h=`attribute vec3 aPosition;\r
attribute vec2 aTexCoord;\r
attribute vec3 aNormal;\r
uniform mat4 uProjectionMatrix;\r
uniform mat4 uModelViewMatrix;\r
uniform float uFrameCount;\r
\r
varying vec3 vNormal;\r
varying vec2 vTexCoord;\r
\r
void main(){\r
  vNormal = aNormal;\r
  vTexCoord = aTexCoord;\r
\r
  vec4 positionVec4 = vec4(aPosition, 1.0);\r
\r
  float frequency = 20.0;\r
  float amplitude = 0.1;\r
\r
  float modeChange1 = cos(positionVec4.x * frequency + uFrameCount * 0.1);\r
  positionVec4.x += modeChange1 * aNormal.x * amplitude;\r
\r
  float modeChange2 = sin(positionVec4.y * frequency + uFrameCount * 0.1);\r
  positionVec4.y += modeChange2 * aNormal.y * amplitude;\r
\r
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\r
}`,x=`precision highp float;\r
precision highp int;\r
uniform vec2 uResolution;\r
uniform vec2 uMouse;\r
uniform float uTime;\r
varying vec3 vNormal;\r
varying vec2 vTexCoord;\r
const float PI = 3.141592653589793;\r
const float PI2 = 6.28318530718;\r
\r
/*\r
  \u7E70\u308A\u8FD4\u3057\r
*/\r
vec3 map(vec3 position){\r
  return mod(position, 5.0) - 2.5;\r
}\r
\r
/*\r
  sphere\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u307E\u3067\u306E\u6700\u77ED\u8DDD\u96E2\u3092\u6C42\u3081\u308B\r
  \u7403\u4F53\u306F\u3069\u306E\u65B9\u5411\u304B\u3089\u898B\u3066\u3082\u5909\u308F\u3089\u306A\u3044\r
  \u30AB\u30E1\u30E9\u3067\u898B\u308B\u306E\u3067\u30AB\u30E1\u30E9\u304C\u7F6E\u304B\u308C\u3066\u3044\u308B\u5EA7\u6A19\u3092\u5165\u308C\u308B\r
  \u7403\u4F53\u306E\u5927\u304D\u3055\u30921.0\u3068\u3057\u3066\u30AB\u30E1\u30E9\u306E\u4F4D\u7F6E\u30923.0\u3068\u3057\u3066\u8A08\u7B97\u3059\u308B\u3068\u3002\r
  3.0 - 1.0 = 2.0\u3068\u306A\u308B\u3002\r
  \u7403\u4F53\u3068\u30AB\u30E1\u30E9\u306E\u6700\u77ED\u8DDD\u96E2\u306F2.0\u3068\u306A\u308B\u3002\r
*/\r
float sphere(vec3 position, float sphereSize){\r
  return length(map(position)) - sphereSize;\r
}\r
\r
float box(vec3 position, vec3 boxSize){\r
  vec3 d = abs(map(position)) - boxSize;\r
\r
  return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);\r
}\r
\r
/*\r
  \u6CD5\u7DDA\u3092\u6C42\u3081\u308B\r
*/\r
vec3 calcNormal(vec3 rayPosition, vec3 boxSize ){\r
  float d = 0.0001;\r
  float x = box(rayPosition + vec3(d, 0.0, 0.0), boxSize) - box(rayPosition + vec3(-d, 0.0, 0.0), boxSize);\r
  float y = box(rayPosition + vec3(0.0, d, 0.0), boxSize) - box(rayPosition + vec3(0.0, -d, 0.0), boxSize);\r
  float z = box(rayPosition + vec3(0.0, 0.0, d), boxSize) - box(rayPosition + vec3(0.0, 0.0, -d), boxSize);\r
  vec3 normal = normalize(vec3(x, y, z));\r
  return normal;\r
}\r
\r
void main(void){\r
  // vec2 coord = vTexCoord;\r
  vec2 coord = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);\r
  \r
  // \u30AB\u30E1\u30E9\u306E\u4F4D\u7F6E\r
  vec3 cameraPosition = vec3(0.0, 0.0, 2.0);\r
  \r
  // \u30AB\u30E1\u30E9\u306E\u5411\u304D\r
  // z\u304C\u30DE\u30A4\u30CA\u30B9\u306B\u306A\u3063\u3066\u3044\u308B\r
  vec3 cameraDirection = vec3(0.0, 0.0, -1.0);\r
  \r
  // \u30AB\u30E1\u30E9\u306E\u4E0A\u65B9\u5411\r
  vec3 cameraUp = vec3(0.0, 1.0, 0.0);\r
  \r
  // \u6A2A\u65B9\u5411\u306E\u7B97\u51FA\r
  // \u30AB\u30E1\u30E9\u306E\u5411\u304D\u3068\u30AB\u30E1\u30E9\u306E\u4E0A\u65B9\u5411\u304B\u3089\u7B97\u51FA\r
  vec3 cameraSide = cross(cameraDirection, cameraUp);\r
  \r
  // \u30D5\u30A9\u30FC\u30AB\u30B9\u306E\u6DF1\u5EA6\r
  float targetDepth = 0.1;\r
  \r
  // \u8996\u91CE\u89D2 field of view\r
  const float angle = 60.0;\r
  const float fov = angle * 0.5 * PI / 180.0;\r
\r
  // \u8996\u91CE\u89D2\u3092\u8003\u616E\u3057\u305Fray\u3092\u6C42\u3081\u308B\r
  float x = sin(fov) * coord.x;\r
  float y = sin(fov) * coord.y;\r
  float z = -cos(fov);\r
  vec3 ray = normalize(vec3(x, y, z));\r
\r
  const int rayLoopMax = 64;\r
  \r
  // \u7403\u4F53\u3068Box\u306E\u5927\u304D\u3055\r
  const float sphereSize = 1.0;\r
\r
  float size = abs(sin(uTime * 0.25));\r
  vec3 boxSize = vec3(size, size, size);\r
  \r
  // \u8DDD\u96E2\r
  float objectDistance = 0.0;\r
\r
  // ray\u306E\u9577\u3055\r
  float rayLength = 0.0;\r
  \r
  // ray\u306E\u521D\u671F\u4F4D\u7F6E\u306F\u30AB\u30E1\u30E9\u306E\u4F4D\u7F6E\u3068\u540C\u3058\r
  vec3 rayPosition = cameraPosition;\r
  \r
  // ray\u3092\u4F38\u3070\u3057\u3066\u3044\u304F\r
  for(int rayLoop = 0; rayLoop < rayLoopMax; rayLoop++){\r
    // ray\u306E\u4F4D\u7F6E\u304B\u3089\u8DDD\u96E2\u3092\u6C42\u3081\u308B\r
    objectDistance = box(rayPosition, boxSize);\r
    // ray\u306E\u9577\u3055\r
    // rayLength += objectDistance1;\r
    rayLength += objectDistance;\r
    // ray\u306E\u4F4D\u7F6E\u3092\u6C42\u3081\u308B\r
    // ray * ray\u306E\u9577\u3055 + \u30AB\u30E1\u30E9\u306E\u4F4D\u7F6E\r
    rayPosition = cameraPosition + ray * rayLength;\r
  }\r
\r
  // \u5E73\u884C\u5149\u6E90\r
  vec3 directionLigth = vec3(-0.5, 0.5, 0.5);\r
\r
  // ray\u306E\u885D\u7A81\u5224\u5B9A\r
  // ray\u304C\u7A81\u304D\u629C\u3051\u305F\u5834\u5408\u30DE\u30A4\u30CA\u30B9\u306B\u306A\u3063\u3066\u3057\u307E\u3046\u305F\u3081abs\u3092\u4F7F\u3044\u7D76\u5BFE\u5024\u306B\u3057\u3066\u3044\u308B\u3002\r
  if(abs(objectDistance) < 0.001){\r
    // \u6CD5\u7DDA\u3092\u6C42\u3081\u308B\r
    vec3 normal = calcNormal(rayPosition, boxSize);\r
    // \u30E9\u30A4\u30C6\u30A3\u30F3\u30B0\r
    float diffuese = clamp(dot(directionLigth, normal), 0.1, 1.0);\r
    vec4 color =  vec4(diffuese, diffuese, diffuese, 1.0);\r
    vec4 bgColor = vec4(0.0, 0.0, 0.1, 1.0);\r
    color += bgColor;\r
    gl_FragColor = color;\r
    //gl_FragColor = vec4(normal, 1.0);\r
  } else {\r
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\r
  }\r
}`;const C=(o,n,t)=>{const a=e=>{let r;e.setup=()=>{e.createCanvas(e.windowWidth,e.windowHeight,e.WEBGL),e.noStroke(),e.pixelDensity(1),r=e.createShader(h,x)},e.draw=()=>{e.background(0,0,0),o.getFloatTimeDomainData(n),o.getFloatFrequencyData(t);const i=e.frameCount*.05,l=i*.5;e.push(),e.translate(0,0,0),e.rotateX(i*.05),e.rotateY(i*.05),e.shader(r),r.setUniform("uFrameCount",i),r.setUniform("uResolution",[e.width,e.height]),r.setUniform("uTime",l),e.sphere(e.width*.1,200,200),e.resetShader(),e.pop()},e.windowResized=()=>{e.resizeCanvas(e.windowWidth,e.windowHeight)}};new y(a)},g=o=>{const n=document.createElement("button");n.className="fullScreenButton",n.textContent="fullScreen",o.appendChild(n),n.addEventListener("click",()=>{o.requestFullscreen()})},b=o=>{const n=document.createElement("div");n.className="startWindow";const t=document.createElement("h1");t.textContent="Cyber Change";const a=document.createElement("p");a.textContent="WebAudioAPI\u3068WebGL2\u306E\u58C1\u306B\u3076\u3064\u304B\u3063\u305F\u3082\u306E\u3067\u3059\u3002\u3069\u3046\u306B\u304B\u6539\u826F\u3057\u305F\u3044\u3067\u3059\u3002";const e=document.createElement("button");return e.textContent="Start!!",e.className="startButton",o.appendChild(n),n.appendChild(t),n.appendChild(a),n.appendChild(e),{startWindow:n,startButton:e}},S=o=>{const n=document.createElement("div");n.className="audioController";const t=document.createElement("h3");t.textContent="Audio Controller";const a=document.createElement("button");a.textContent="Play",a.className="audioPlayButton";const e=document.createElement("button");e.textContent="Stop",e.className="audioStopButton";const r=document.createElement("button");r.textContent="+",r.className="audioGainPlusButton";const i=document.createElement("button");i.textContent="-",i.className="audioGainMinusButton",o.appendChild(n),n.appendChild(t),n.appendChild(a),n.appendChild(e),n.appendChild(r),n.appendChild(i)},w=async(o,n)=>{const a=await(await fetch(n)).arrayBuffer();return await o.decodeAudioData(a)};var B="./assets/beat.1ed1a389.wav";const u=document.body;g(u);const m=b(u);m.startButton.addEventListener("click",async()=>{u.removeChild(m.startWindow),S(u);let o=!1,n,t;const a=(c,s,d)=>{n=c.createBufferSource(),n.buffer=s,n.connect(t).connect(d).connect(c.destination),n.start(),o=!0},e=document.querySelector(".audioPlayButton");if(!(e instanceof HTMLButtonElement))throw new Error("Error");e.addEventListener("click",async()=>{const c=new AudioContext,s=c.createAnalyser();if(t=c.createGain(),o===!0)return;const d=await w(c,B);a(c,d,s);const f=new Float32Array(s.fftSize),v=new Float32Array(s.frequencyBinCount);C(s,f,v)});const r=document.querySelector(".audioStopButton");if(!(r instanceof HTMLButtonElement))throw new Error("Error");r.addEventListener("click",async()=>{const c=document.querySelector("main");if(!(c instanceof HTMLElement))throw new Error("Error");u.removeChild(c),n.stop(),o=!1});const i=document.querySelector(".audioGainPlusButton");if(!(i instanceof HTMLButtonElement))throw new Error("Error");i.addEventListener("click",()=>{t.gain.value<1&&(t.gain.value+=.05)});const l=document.querySelector(".audioGainMinusButton");if(!(l instanceof HTMLButtonElement))throw new Error("Error");l.addEventListener("click",()=>{t.gain.value>.05&&(t.gain.value-=.05)})});
