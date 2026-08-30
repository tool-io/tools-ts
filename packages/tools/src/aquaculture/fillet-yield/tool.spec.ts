import { describe, expect, it } from "vitest";
import { calculateFilletYield, example, runFilletYield } from "./tool.js";

describe("aquaculture/fillet-yield", () => {
  it("calculates the published example", () => {
    expect(calculateFilletYield(example.input)).toEqual(example.output);
    expect(runFilletYield(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFilletYield({
      ...example.input,
      filletWeightKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runFilletYield({ ...example.input, wholeWeightKilograms: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "wholeWeightKilograms" }] },
    });
  });
});
