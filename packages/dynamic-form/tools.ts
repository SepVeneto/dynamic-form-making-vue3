function traverseObj(data: Record<string, any>, keys: string[], index: number): any {
  const key = keys[index];
  const res = data[key];
  if (typeof res === 'object' && !Array.isArray(res)) {
    return traverseObj(res, keys, index + 1);
  } else {
    return res;
  }
}
export function getValue(data: Record<string, any>, key: string): any {
  const path = key.split('.');
  const res = traverseObj(data, path, 0);
  return res;
}

export function setValue(data: Record<string, any>, key: string, value: any): void {
  const path = key.split('.');
  let keyIndex = 1;
  let objIndex = 0;
  if (path.length === 1) {
    data[key] = value;
  }
  let dataP = data;
  for(; keyIndex < path.length; ++keyIndex, ++objIndex) {
    const ok = path[objIndex];
    if (dataP[ok] == null) {
      dataP[ok] = {};
    }
    dataP = dataP[ok];
  }
  dataP[path[path.length - 1]] = value;
}