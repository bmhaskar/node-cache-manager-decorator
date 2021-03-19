export function defaultKeyFn(name, args) {
  const defaultKey = [name];
  if (Array.isArray(args) && args.length) {
    defaultKey.push(args[0]);
  }
  return defaultKey;
}
