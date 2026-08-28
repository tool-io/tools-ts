import { describe, expect, it } from "vitest";
import { runPartitionCoefficient } from "./tool.js";

describe("Partition Coefficient Calculator", () => {
  it("calculates a valid result", () => {
    const result = runPartitionCoefficient({
      organicConcentrationMolL: 1,
      aqueousConcentrationMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.partitionCoefficient).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runPartitionCoefficient(null).ok).toBe(false));
});
