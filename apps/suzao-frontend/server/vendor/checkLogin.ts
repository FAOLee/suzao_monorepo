// 检测用户是否登录
export default defineEventHandler(async (event) => {
  const repo = await $fetch('/vendor/checkLogin', {})
  return repo
})
