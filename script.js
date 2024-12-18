function detectarScroll(el) {
  var elements = document.querySelectorAll("."+el);
  if (elements){
      elements.forEach(function (element) {
          var position = element.getBoundingClientRect();

          // Verifica se o elemento está visível no viewport
          if (position.top < window.innerHeight && position.bottom >= 20) {
              element.id = el; // Adiciona a classe
          }
      });

  }
}
window.addEventListener("scroll",function() {
  detectarScroll("linha")
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const esfera = document.getElementById("espaco_esfera");
esfera.appendChild(renderer.domElement);

// Função para criar cubos com brilho
function createCube() {
  // Geometria do cubo
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  
  // Material com brilho (usando MeshStandardMaterial para refletir luz)
  const material = new THREE.MeshStandardMaterial({
    color: 0x555555,   // Cor base
    roughness: 0.3,    // Menos rugosidade, para mais brilho
    metalness: 0.9,    // Alta metalicidade para efeito de brilho
  });

  // Mesh com a geometria e material
  const cube = new THREE.Mesh(geometry, material);

  // Adicionando um brilho através de luzes
  const edges = new THREE.EdgesGeometry(geometry);  // Calcula as arestas
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFA500, linewidth: 2 });  // Cor laranja para arestas
  const line = new THREE.LineSegments(edges, lineMaterial);  // Cria as linhas das arestas
  cube.add(line);  // Adiciona as arestas ao cubo

  return cube;
}

// Adicionar 300 cubos à cena
const cubes = [];
for (let i = 0; i < 100; i++) {
  const cube = createCube();
  cube.position.set(
    (Math.random() - 0.5) * 50,  // Posição X
    (Math.random() - 0.5) * 50,  // Posição Y
    (Math.random() - 0.5) * 50   // Posição Z
  );
  cube.rotationSpeed = new THREE.Vector3(
    Math.random() * 0.01 - 0.005,  // Velocidade de rotação X
    Math.random() * 0.01 - 0.005,  // Velocidade de rotação Y
    Math.random() * 0.01 - 0.005   // Velocidade de rotação Z
  );
  scene.add(cube);
  cubes.push(cube);
}

// Adicionar uma luz para refletir o brilho
const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente suave
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Luz pontual
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Configuração da câmera
camera.position.z = 20;

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  // Girar cada cubo de forma aleatória
  cubes.forEach(cube => {
    cube.rotation.x += cube.rotationSpeed.x;
    cube.rotation.y += cube.rotationSpeed.y;
    cube.rotation.z += cube.rotationSpeed.z;
  });

  // Renderiza a cena
  renderer.render(scene, camera);
}

// Redimensionar a janela corretamente
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Iniciar a animação
animate();


const slider = document.getElementById("cards");
// Seleciona o elemento de rolagem horizontal (com id "cards")

// Adiciona o evento de scroll (wheel)
var canvas = document.querySelector("#scene"),
  ctx = canvas.getContext("2d"),
  particles = [],
  amount = 0,
  mouse = {x:0,y:0},
  radius = 1;

var colors = ["#898346","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];



var ww = 1500;
var wh = 1500;

function Particle(x,y){
  this.x =  Math.random()*ww;
  this.y =  Math.random()*wh;
  this.dest = {
    x : x,
    y: y
  };
  this.r =  Math.random()*5 + 2;
  this.vx = (Math.random()-0.5)*20;
  this.vy = (Math.random()-0.5)*20;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + 0.94;

  this.color = colors[Math.floor(Math.random()*6)];
}

Particle.prototype.render = function() {


  this.accX = (this.dest.x - this.x)/600;
  this.accY = (this.dest.y - this.y)/600;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y +=  this.vy;

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  ctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  if(distance<(radius*70)){
    this.accX = (this.x - mouse.x)/100;
    this.accY = (this.y - mouse.y)/100;
    this.vx += this.accX;
    this.vy += this.accY;
  }

}

function onMouseMove(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e){
  if(e.touches.length > 0 ){
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

function onTouchEnd(e){
mouse.x = -9999;
mouse.y = -9999;
}

function initScene(){
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "900 "+(ww/7)+"px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("?", ww/2, wh/2);

  var data  = ctx.getImageData(0, 0, ww, wh).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "screen";

  particles = [];
  for(var i=0;i<ww;i+=Math.round(ww/170)){
    for(var j=0;j<wh;j+=Math.round(ww/170)){
      if(data[ ((i + j*ww)*4) + 3] > 150){
        particles.push(new Particle(i,j));
      }
    }
  }
  amount = particles.length;

}

function onMouseClick(){
  radius++;
  if(radius ===5){
    radius = 0;
  }
}

function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
};


window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);


/*------------------------------
        Album Cover Slider
--------------------------------*/
//start added by Chase
var a = document.getElementsByClassName("coverflow__image");
var cfImg = document.getElementsByClassName("coverflow__image")

var scaleI = 0;
for (scaleI; scaleI < a.length; scaleI++) {
  if (scaleI === 3) {
    continue;
  } else {
    a[scaleI].style.cursor = "default";
    a[scaleI].addEventListener("click", prevDef);
  }
}

function prevDef(e) {
  e.preventDefault();
}

function forScale(coverflowPos) {
  for (scaleI = 0; scaleI < a.length; scaleI++) {
  }
  for (scaleI = 0; scaleI < cfImg.length; scaleI++) {
    if (cfImg[scaleI].getAttribute("data-coverflow-index") == coverflowPos) {
      cfImg[scaleI].parentElement.style.cursor = "pointer";
      cfImg[scaleI].parentElement.removeEventListener("click", prevDef);
    }
  }
}
//end added by Chase

function setupCoverflow(coverflowContainer) {
  var coverflowContainers;

  if (typeof coverflowContainer !== "undefined") {
    if (Array.isArray(coverflowContainer)) {
      coverflowContainers = coverflowContainer;
    } else {
      coverflowContainers = [coverflowContainer];
    }
  } else {
    coverflowContainers = Array.prototype.slice.apply(document.getElementsByClassName('coverflow'));
  }

  coverflowContainers.forEach(function(containerElement) {
    var coverflow = {};
    var prevArrows, nextArrows;

    //capture coverflow elements
    coverflow.container = containerElement;
    coverflow.images = Array.prototype.slice.apply(containerElement.getElementsByClassName('coverflow__image'));
    coverflow.position = Math.floor(coverflow.images.length / 2) + 1;

    //set indicies on images
    coverflow.images.forEach(function(coverflowImage, i) {
      coverflowImage.dataset.coverflowIndex = i + 1;
    });

    //set initial position
    coverflow.container.dataset.coverflowPosition = coverflow.position;

    //get prev/next arrows
    prevArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("prev-arrow"));
    nextArrows = Array.prototype.slice.apply(coverflow.container.getElementsByClassName("next-arrow"));

    //add event handlers
    function setPrevImage() {
      coverflow.position = Math.max(1, coverflow.position - 1);
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //call the functin forScale added
      forScale(coverflow.position);
    }

    function setNextImage() {
      coverflow.position = Math.min(coverflow.images.length, coverflow.position + 1);
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //call the function Chase added
      forScale(coverflow.position);
    }

    function jumpToImage(evt) {
      coverflow.position = Math.min(coverflow.images.length, Math.max(1, evt.target.dataset.coverflowIndex));
      coverflow.container.dataset.coverflowPosition = coverflow.position;
      //start added by Chase
      setTimeout(function() {
        forScale(coverflow.position);
      }, 1);
      //end added by Chase
    }

    function onKeyPress(evt) {
      switch (evt.which) {
        case 37: //left arrow
          setPrevImage();
          break;
        case 39: //right arrow
          setNextImage();
          break;
      }
    }
    prevArrows.forEach(function(prevArrow) {
      prevArrow.addEventListener('click', setPrevImage);
    });
    nextArrows.forEach(function(nextArrow) {
      nextArrow.addEventListener('click', setNextImage);
    });
    coverflow.images.forEach(function(image) {
      image.addEventListener('click', jumpToImage);
    });
    window.addEventListener('keyup', onKeyPress);
  });
}

setupCoverflow();
