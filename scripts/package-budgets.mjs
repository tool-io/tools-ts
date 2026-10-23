// Keep the full collection's runtime, declarations and metadata within reviewed bounds.
// Raising these ceilings requires an explicit footprint review in the change.
export const packageBudgets = Object.freeze({
  compressedBytes: 40 * 1024 * 1024,
  unpackedBytes: 280 * 1024 * 1024,
  files: 180_000,
});

export const packageBudgetIssues = (metrics) =>
  Object.entries(packageBudgets).flatMap(([key, ceiling]) => {
    const value = metrics[key];
    if (!Number.isSafeInteger(value) || value < 1)
      return [`Package metric ${key} must be a positive safe integer.`];
    return value > ceiling
      ? [`Package ${key} exceeds its reviewed ceiling (${value} > ${ceiling}).`]
      : [];
  });
