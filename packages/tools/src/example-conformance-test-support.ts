export const selectConformanceTools = <T>(
  tools: readonly T[],
  shard?: string,
): { tools: readonly T[]; start: number } => {
  if (shard === undefined) return { tools, start: 0 };
  const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(shard);
  if (!match)
    throw new Error("TOOLIO_EXAMPLE_SHARD must be index/count, starting at 1.");
  const index = Number(match[1]);
  const count = Number(match[2]);
  if (
    !Number.isSafeInteger(index) ||
    !Number.isSafeInteger(count) ||
    index > count ||
    count > Math.max(1, tools.length)
  )
    throw new Error("Invalid authored-example shard bounds.");
  const start = Math.floor((tools.length * (index - 1)) / count);
  return {
    tools: tools.slice(start, Math.floor((tools.length * index) / count)),
    start,
  };
};
