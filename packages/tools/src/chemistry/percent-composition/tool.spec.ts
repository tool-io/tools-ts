import { describe, expect, it } from "vitest";
import { percentCompositionExample, runPercentComposition } from "./tool.js";

describe("Percent Composition Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPercentComposition(percentCompositionExample.input)).toEqual({
      ok: true,
      output: percentCompositionExample.output,
    });
  });

  it("computes twenty-five percent for one quarter of the mass", () => {
    expect(
      runPercentComposition({
        elementMassContributedG: 12,
        compoundMolarMassG: 48,
      }),
    ).toEqual({
      ok: true,
      output: { percentComposition: 25 },
    });
  });

  it("computes one hundred percent when the element is the compound", () => {
    expect(
      runPercentComposition({
        elementMassContributedG: 20,
        compoundMolarMassG: 20,
      }),
    ).toEqual({
      ok: true,
      output: { percentComposition: 100 },
    });
  });

  it("rejects a contribution above the molar mass", () => {
    const result = runPercentComposition({
      elementMassContributedG: 90,
      compoundMolarMassG: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("returns zero for an absent element", () =>
    expect(
      runPercentComposition({
        elementMassContributedG: 0,
        compoundMolarMassG: 80,
      }),
    ).toEqual({ ok: true, output: { percentComposition: 0 } }));

  it("rejects a negative compound molar mass", () => {
    const result = runPercentComposition({
      elementMassContributedG: 16,
      compoundMolarMassG: -80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("requires both masses", () => {
    expect(runPercentComposition({ elementMassContributedG: 16 }).ok).toBe(
      false,
    );
    expect(runPercentComposition({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runPercentComposition(16).ok).toBe(false);
  });
});
