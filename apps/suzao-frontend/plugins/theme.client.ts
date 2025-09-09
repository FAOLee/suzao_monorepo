export default defineNuxtPlugin(() => {
  // 防止主题闪烁的脚本，在客户端立即执行
  const script = `
    (function() {
      const theme = localStorage.getItem('theme') || 'system';
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const actualTheme = theme === 'system' ? systemTheme : theme;
      
      if (actualTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      document.documentElement.setAttribute('data-theme', actualTheme);
    })();
  `;

  if (process.client) {
    const scriptEl = document.createElement('script');
    scriptEl.innerHTML = script;
    document.head.appendChild(scriptEl);
  }
})