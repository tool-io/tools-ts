import { describe, expect, it } from "vitest";
import { plateletCountExample, runPlateletCount } from "./tool.js";

describe("Platelet Count Correction", () => {
  it("publishes an executable example", () =>
    expect(runPlateletCount(plateletCountExample.input)).toEqual({
      ok: true,
      output: plateletCountExample.output,
    }));
  it("uses all defaults when only the count is given", () =>
    expect(runPlateletCount({ countedPlatelets: 12 })).toEqual({
      ok: true,
      output: { plateletsKPerUl: 1200 },
    }));
  it("spreads across multiple chambers", () =>
    expect(
      runPlateletCount({
        countingChambersInt: 4,
        countedPlatelets: 800,
        dilutionFactor: 100,
      }),
    ).toEqual({ ok: true, output: { plateletsKPerUl: 20000 } }));
  it("honors a custom dilution factor", () =>
    expect(
      runPlateletCount({ countedPlatelets: 30, dilutionFactor: 10 }),
    ).toEqual({ ok: true, output: { plateletsKPerUl: 300 } }));
  it("accepts zero counted platelets", () =>
    expect(runPlateletCount({ countedPlatelets: 0 })).toEqual({
      ok: true,
      output: { plateletsKPerUl: 0 },
    }));
  it("rejects negative counts", () => {
    const result = runPlateletCount({ countedPlatelets: -10 });
    expect(result.ok).toBe(false);
  });
  it("rejects chamber counts below one", () => {
    const result = runPlateletCount({
      countedPlatelets: 10,
      countingChambersInt: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer chambers", () => {
    const result = runPlateletCount({
      countedPlatelets: 10,
      countingChambersInt: 1.5,
    });
    expect(result.ok).toBe(false);
  });
});
