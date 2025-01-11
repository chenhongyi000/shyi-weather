import { WebviewWindow, getCurrent } from '@tauri-apps/api/window'

export async function createMainWindow() {
  const mainWindow = new WebviewWindow('main', {
    url: '/weather'
  })

  await mainWindow.once('tauri://created', async () => {
    const loginWindow = getCurrent()
    await loginWindow.close()
  })

  return mainWindow
}

export function getMainWindow() {
  return WebviewWindow.getByLabel('main')
}

export function getLoginWindow() {
  return WebviewWindow.getByLabel('login')
} 