export const modules = import.meta.glob('../components/*.vue', { eager: true });

// 组件名数组（去掉.vue后缀）
export const componentNames: string[] = Object.keys(modules).map((path) => {
  const match = path.match(/\/components\/(.*)\.vue$/);
  // 直接match[1]可能为null,不匹配时返回路径
  return match ? match[1] : path;
});
