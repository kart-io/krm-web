<template>
  <div class="particle-network" ref="containerRef">
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    <div class="particles">
      <div 
        v-for="(particle, index) in particles" 
        :key="index"
        class="particle"
        :style="getParticleStyle(particle)"
      >
        <span class="particle-text">{{ particle.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  text: string
  size: number
  opacity: number
  connections: number[]
}

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const canvasWidth = ref(1200)
const canvasHeight = ref(800)
const particles = ref<Particle[]>([])

// 粒子文本内容 - 基于截图中的技术词汇
const particleTexts = [
  'kubernetes', 'docker', 'devops', 'microservices', 'containers',
  'helm', 'kubectl', 'ingress', 'pods', 'services', 'deployments',
  'namespaces', 'configmap', 'secrets', 'volumes', 'nodes',
  'clusters', 'monitoring', 'logging', 'prometheus', 'grafana',
  'jenkins', 'ci/cd', 'pipeline', 'automation', 'orchestration',
  'scaling', 'load balancing', 'service mesh', 'istio', 'envoy',
  'redis', 'mysql', 'mongodb', 'elasticsearch', 'kafka',
  'nginx', 'apache', 'traefik', 'api gateway', 'security',
  'rbac', 'network policies', 'storage', 'persistent volumes',
  'operators', 'custom resources', 'webhooks', 'controllers'
]

let animationId: number
let ctx: CanvasRenderingContext2D | null = null

const createParticles = () => {
  const particleCount = 35
  particles.value = []
  
  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      id: i,
      x: Math.random() * canvasWidth.value,
      y: Math.random() * canvasHeight.value,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      text: particleTexts[Math.floor(Math.random() * particleTexts.length)],
      size: Math.random() * 3 + 8,
      opacity: Math.random() * 0.6 + 0.4,
      connections: []
    })
  }
}

const updateParticles = () => {
  particles.value.forEach(particle => {
    // 更新位置
    particle.x += particle.vx
    particle.y += particle.vy
    
    // 边界反弹
    if (particle.x <= 0 || particle.x >= canvasWidth.value) {
      particle.vx *= -1
    }
    if (particle.y <= 0 || particle.y >= canvasHeight.value) {
      particle.vy *= -1
    }
    
    // 保持在边界内
    particle.x = Math.max(0, Math.min(canvasWidth.value, particle.x))
    particle.y = Math.max(0, Math.min(canvasHeight.value, particle.y))
  })
}

const drawConnections = () => {
  if (!ctx) return
  
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'
  ctx.lineWidth = 1
  
  particles.value.forEach((particle, i) => {
    particle.connections = []
    
    particles.value.forEach((otherParticle, j) => {
      if (i !== j) {
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 180) {
          const opacity = (180 - distance) / 180 * 0.4
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
          
          if (!particle.connections.includes(j)) {
            particle.connections.push(j)
          }
        }
      }
    })
  })
  
  ctx.globalAlpha = 1
}

const getParticleStyle = (particle: Particle) => {
  return {
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    opacity: particle.opacity,
    fontSize: `${particle.size}px`,
    transform: `translate(-50%, -50%)`
  }
}

const animate = () => {
  updateParticles()
  drawConnections()
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (containerRef.value) {
    canvasWidth.value = containerRef.value.offsetWidth
    canvasHeight.value = containerRef.value.offsetHeight
    
    if (canvasRef.value) {
      canvasRef.value.width = canvasWidth.value
      canvasRef.value.height = canvasHeight.value
    }
    
    createParticles()
  }
}

onMounted(async () => {
  await nextTick()
  
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
  
  handleResize()
  createParticles()
  animate()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-network {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);
  z-index: 1;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.particles {
  position: relative;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.3s ease;
}

.particle-text {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
  text-shadow: 0 0 10px rgba(100, 116, 139, 0.3);
  white-space: nowrap;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.particle:hover .particle-text {
  color: #3b82f6;
  opacity: 1;
  text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  transform: scale(1.1);
}

/* 添加闪烁效果 */
@keyframes twinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.particle:nth-child(3n) .particle-text {
  animation: twinkle 3s infinite;
}

.particle:nth-child(5n) .particle-text {
  animation: twinkle 4s infinite;
  animation-delay: 1s;
}

.particle:nth-child(7n) .particle-text {
  animation: twinkle 5s infinite;
  animation-delay: 2s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .particle-text {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .particle-text {
    font-size: 8px;
  }
}
</style>