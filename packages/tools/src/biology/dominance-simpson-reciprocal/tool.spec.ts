import { describe, expect, it } from "vitest";
import { runSimpsonReciprocal, simpsonReciprocalExample } from "./tool.js";

describe("Simpson Reciprocal", () => {
  it("publishes an executable example", () =>
    expect(runSimpsonReciprocal(simpsonReciprocalExample.input)).toEqual({
      ok: true,
      output: simpsonReciprocalExample.output,
    }));
  it("inverts mid-range concentrations", () =>
    expect(runSimpsonReciprocal({ simpsonD: 0.5 })).toEqual({
      ok: true,
      output: { simpsonReciprocal: 2 },
    }));
  it("approaches one as dominance approaches one", () => {
    const result = runSimpsonReciprocal({ simpsonD: 0.999 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.simpsonReciprocal).toBeCloseTo(1 / 0.999, 12);
  });
  it("equals the Hill N2 transform", () =>
    expect(runSimpsonReciprocal({ simpsonD: 0.125 })).toEqual({
      ok: true,
      output: { simpsonReciprocal: 8 },
    }));
  it("rejects zero concentration", () =>
    expect(runSimpsonReciprocal({ simpsonD: 0 }).ok).toBe(false));
  it("returns one for complete dominance", () =>
    expect(runSimpsonReciprocal({ simpsonD: 1 })).toEqual({
      ok: true,
      output: { simpsonReciprocal: 1 },
    }));
  it("rejects concentrations above one", () =>
    expect(runSimpsonReciprocal({ simpsonD: 1.5 }).ok).toBe(false));
});
