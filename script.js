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


const slider = document.querySelector(".cards");

// Adiciona o evento de scroll (wheel)
slider.addEventListener("wheel", (e) => {
    // Previne o comportamento padrão (como rolar a página)
    e.preventDefault();

    // Calcula o quanto o slider deve mover com base no scroll
    const scrollAmount = e.deltaY; // deltaY é o valor do movimento do mouse (positivo para baixo, negativo para cima)
    
    // Ajusta o scroll do slider de acordo com o valor do scroll
    slider.scrollLeft += scrollAmount;
});

slider.addEventListener("mousedown", (e) => {
  // Verifica se o botão pressionado é o do meio (scroll)
  if (e.button === 1) {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;

      // Evita o comportamento padrão do navegador ao pressionar o botão de scroll (como o "auto-scroll")
      e.preventDefault();
  }
});

// Quando o botão do scroll é solto
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});

// Quando o cursor sai da área do slider
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});

// Movimento do slider enquanto o botão de scroll está pressionado
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();

  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; // A velocidade do scroll horizontal
  slider.scrollLeft = scrollLeft - walk;
});
