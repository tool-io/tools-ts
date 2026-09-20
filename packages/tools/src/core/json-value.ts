/** Plain, finite JSON data, without invoking getters or toJSON methods. */
export const isPortableJsonValue = (value: unknown): boolean => {
  const active = new Set<object>();
  const pending: { value: unknown; leaving?: boolean }[] = [{ value }];
  try {
    while (pending.length > 0) {
      const frame = pending.pop()!;
      const current = frame.value;
      if (
        current === null ||
        typeof current === "boolean" ||
        typeof current === "string"
      )
        continue;
      if (typeof current === "number") {
        if (!Number.isFinite(current)) return false;
        continue;
      }
      if (typeof current !== "object") return false;
      if (frame.leaving) {
        active.delete(current);
        continue;
      }
      if (active.has(current)) return false;
      active.add(current);
      pending.push({ value: current, leaving: true });
      const keys = Reflect.ownKeys(current);
      if (Array.isArray(current)) {
        if (keys.length !== current.length + 1) return false;
        for (let index = current.length - 1; index >= 0; index -= 1) {
          const descriptor = Object.getOwnPropertyDescriptor(
            current,
            String(index),
          );
          if (!descriptor || !Object.hasOwn(descriptor, "value")) return false;
          pending.push({ value: descriptor.value });
        }
      } else {
        const prototype: unknown = Object.getPrototypeOf(current);
        if (prototype !== Object.prototype && prototype !== null) return false;
        for (const key of keys) {
          const descriptor = Object.getOwnPropertyDescriptor(current, key);
          if (
            typeof key !== "string" ||
            !descriptor?.enumerable ||
            !Object.hasOwn(descriptor, "value")
          )
            return false;
          pending.push({ value: descriptor.value });
        }
      }
    }
    return true;
  } catch {
    return false;
  }
};
