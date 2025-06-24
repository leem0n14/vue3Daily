const rawModules = import.meta.glob('../components/**/*.vue', { eager: true });
export const modules: Record<string, any> = {};

Object.keys(rawModules).forEach(path => {
  const match = path.match(/\/components\/(.+?)(?:\/index)?\.vue$/);
  if (match) {
    const name = match[1].replace(/\/index$/, '');
    modules[name] = rawModules[path];
  }
});

export const componentNames: string[] = Object.keys(modules);
