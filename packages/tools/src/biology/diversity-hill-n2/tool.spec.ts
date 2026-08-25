import { describe, expect, it } from "vitest";
import { hillN2Example, runHillN2 } from "./tool.js";

describe("Hill Number N2", () => {
  it("publishes an executable example", () =>
    expect(runHillN2(hillN2Example.input)).toEqual({
      ok: true,
      output: hillN2Example.output,
    }));
  it("inverts the Simpson concentration", () =>
    expect(runHillN2({ simpsonConcentrationD: 0.5 })).toEqual({
      ok: true,
      output: { hillN2: 2 },
    }));
  it("approaches one as dominance approaches one", () => {
    const result = runHillN2({ simpsonConcentrationD: 0.99 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.hillN2).toBeCloseTo(1 / 0.99, 12);
  });
  it("grows large near zero concentration", () => {
    const result = runHillN2({ simpsonConcentrationD: 0.001 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.hillN2).toBeCloseTo(1000, 9);
  });
  it("rejects zero concentration", () =>
    expect(runHillN2({ simpsonConcentrationD: 0 }).ok).toBe(false));
  it("returns one for a single-species community", () =>
    expect(runHillN2({ simpsonConcentrationD: 1 })).toEqual({
      ok: true,
      output: { hillN2: 1 },
    }));
  it("rejects negative concentration", () =>
    expect(runHillN2({ simpsonConcentrationD: -0.25 }).ok).toBe(false));
});
