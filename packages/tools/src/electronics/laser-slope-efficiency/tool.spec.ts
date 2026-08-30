import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLaserSlopeEfficiency, example } from "./tool.js";

describe("electronics/laser-slope-efficiency", () => {
  it("matches its worked example", () => {
    expect(calculateLaserSlopeEfficiency(example.input)).toEqual(
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
    expect(
      tool.execute({ ...example.input, powerChangeWatts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires an increasing drive current", () => {
    expect(tool.execute({ ...example.input, currentChangeAmperes: 0 }).ok).toBe(
      false,
    );
  });
});
