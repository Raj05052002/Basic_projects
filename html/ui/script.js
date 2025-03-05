const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];
const maxNodes = 100;
const nodeRadius = 4;
const nodeHoverRadius = 10;
let mouse = { x: null, y: null };

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = nodeRadius;
    this.xSpeed = (Math.random() - 0.5) * 2;
    this.ySpeed = (Math.random() - 0.5) * 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  update() {
    // Update node position
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > canvas.height) this.ySpeed *= -1;

    // Handle mouse hover effect
    let dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
    if (dist < nodeHoverRadius) {
      this.radius = nodeHoverRadius;  // Increase size on hover
    } else {
      this.radius = nodeRadius;  // Reset size when not hovered
    }

    this.draw();
  }
}

function createNodes() {
  for (let i = 0; i < maxNodes; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    nodes.push(new Node(x, y));
  }
}

function connectNodes() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 150})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
}

function handleMouseMove(event) {
  // Update mouse coordinates on movement
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(node => {
    node.update();
  });

  connectNodes();
  requestAnimationFrame(animate);
}

// Initialize the nodes and animation
createNodes();
animate();

// Event listener to track mouse movement
canvas.addEventListener('mousemove', handleMouseMove);

// Reset mouse coordinates when mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});
