import { defineConfig } from '@lynx-js/rspeedy'
import { networkInterfaces } from 'os'

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'

/**
 * 获取本机的局域网 IP 地址（通常是 192.168.x.x 或 10.x.x.x）
 * 如果找不到，回退到 localhost
 */
function getLocalNetworkIP(): string {
  const interfaces = networkInterfaces()
  const candidates: { name: string; address: string }[] = []

  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name]
    if (!nets) continue
    for (const net of nets) {
      // 跳过内部（localhost）和非 IPv4 地址
      if (net.family === 'IPv4' && !net.internal) {
        candidates.push({ name, address: net.address })
      }
    }
  }

  // 优先选择 Wi-Fi 或以太网接口，排除虚拟适配器
  const preferred = candidates.find(c => 
    (c.name.toLowerCase().includes('wi-fi') || 
     c.name.toLowerCase().includes('wlan') || 
     c.name.toLowerCase().includes('eth') || 
     c.name.toLowerCase().includes('en')) &&
    !c.name.toLowerCase().includes('vmware') &&
    !c.name.toLowerCase().includes('virtual') &&
    !c.name.toLowerCase().includes('vethernet') &&
    !c.name.toLowerCase().includes('wsl')
  )

  if (preferred) {
    return preferred.address
  }

  // 如果没有首选的，排除掉明显的虚拟适配器后再选一个
  const backup = candidates.find(c => 
    !c.name.toLowerCase().includes('vmware') &&
    !c.name.toLowerCase().includes('virtual') &&
    !c.name.toLowerCase().includes('vethernet') &&
    !c.name.toLowerCase().includes('wsl')
  )

  if (backup) {
    return backup.address
  }

  // 最后回退到第一个找到的，或者 localhost
  return candidates[0]?.address || 'localhost'
}

export default defineConfig({
  // 配置开发服务器，允许局域网设备访问
  // host: '0.0.0.0' 表示监听所有网络接口，但二维码中需要使用实际 IP
  server: {
    host: '0.0.0.0',
    port: 3000,
    // 允许跨域请求，方便手机访问
    cors: true,
    // 允许所有来源访问（仅开发环境）
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // 将 URL 中的 0.0.0.0 或 localhost 替换为实际的局域网 IP
        // 这样手机才能通过局域网访问开发服务器
        const localIP = getLocalNetworkIP()
        const correctedUrl = url
          .replace(/0\.0\.0\.0/g, localIP)
          .replace(/localhost/g, localIP)
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${correctedUrl}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
  ],
})
