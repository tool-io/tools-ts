import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFloorSqueakScrewCount, example } from "./tool.js";

describe("construction/floor-squeak-screw-count", () => {
  it("matches its worked example", () => {
    expect(calculateFloorSqueakScrewCount(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, runMeters: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative runMeters", () => {
    expect(tool.execute({ ...example.input, runMeters: -1 }).ok).toBe(false);
  });
});
