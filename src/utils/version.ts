import { createVersionPolling } from 'version-polling'

export const checkIndex = () =>
  createVersionPolling({
    silent: import.meta.env.DEV,
    pollingInterval: 5 * 60 * 1000,
    onUpdate(self) {
      alert('页面有更新,点击确定刷新页面!')
      self.onRefresh()
    },
  })
