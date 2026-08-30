import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateGreatCircleInitialBearing, example } from "./tool.js";

describe("cartography/great-circle-initial-bearing", () => {
  it("matches its worked example", () => {
    expect(calculateGreatCircleInitialBearing(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects antipodal coordinates where the initial bearing is undefined", () => {
    expect(
      tool.execute({
        latitude1Degrees: 0,
        longitude1Degrees: 0,
        latitude2Degrees: 0,
        longitude2Degrees: 180,
      }).ok,
    ).toBe(false);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, latitude1Degrees: Number.NaN }).ok,
    ).toBe(false);
  });
});
