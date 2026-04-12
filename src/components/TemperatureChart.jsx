import { useEffect, useRef } from 'react'
import styles from './TemperatureChart.module.css'

export default function TemperatureChart({ data }) {
  const canvasRef = useRef(null)

  const points = data.list.slice(0, 8).map(item => ({
    time: item.dt_txt.split(' ')[1].slice(0, 5),
    temp: Math.round(item.main.temp),
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || points.length === 0) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    if (!W || !H) return

    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 28, right: 24, bottom: 36, left: 24 }
    const w = W - pad.left - pad.right
    const h = H - pad.top - pad.bottom

    const temps = points.map(p => p.temp)
    const minT = Math.min(...temps) - 3
    const maxT = Math.max(...temps) + 3

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#4a9eff'

    function xPos(i) { return pad.left + (i / (points.length - 1)) * w }
    function yPos(t) { return pad.top + h - ((t - minT) / (maxT - minT)) * h }

    // Gradiente bajo la curva
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h)
    grad.addColorStop(0, accent + '35')
    grad.addColorStop(1, accent + '00')

    // Área rellena
    ctx.beginPath()
    ctx.moveTo(xPos(0), yPos(points[0].temp))
    for (let i = 1; i < points.length; i++) {
      const cpx = (xPos(i - 1) + xPos(i)) / 2
      ctx.bezierCurveTo(cpx, yPos(points[i - 1].temp), cpx, yPos(points[i].temp), xPos(i), yPos(points[i].temp))
    }
    ctx.lineTo(xPos(points.length - 1), pad.top + h)
    ctx.lineTo(xPos(0), pad.top + h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Línea de la curva
    ctx.beginPath()
    ctx.moveTo(xPos(0), yPos(points[0].temp))
    for (let i = 1; i < points.length; i++) {
      const cpx = (xPos(i - 1) + xPos(i)) / 2
      ctx.bezierCurveTo(cpx, yPos(points[i - 1].temp), cpx, yPos(points[i].temp), xPos(i), yPos(points[i].temp))
    }
    ctx.strokeStyle = accent
    ctx.lineWidth = 2
    ctx.stroke()

    // Puntos, temperaturas y horas
    points.forEach((p, i) => {
      const x = xPos(i)
      const y = yPos(p.temp)

      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = accent
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#0d0e1a'
      ctx.fill()

      ctx.fillStyle = 'rgba(232, 234, 246, 0.9)'
      ctx.font = '500 11px "DM Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${p.temp}°`, x, y - 10)

      ctx.fillStyle = 'rgba(90, 96, 128, 0.85)'
      ctx.font = '400 10px "DM Mono", monospace'
      ctx.fillText(p.time, x, H - 10)
    })
  }, [points])

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Temperatura — próximas 24h</p>
      <div className={styles.chartWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  )
}