import { describe, expect, it } from "vitest";
import { runStainDilution, stainDilutionExample } from "./tool.js";

describe("Stain Dilution Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runStainDilution(stainDilutionExample.input)).toEqual({
      ok: true,
      output: stainDilutionExample.output,
    }));

  it("keeps the volume unchanged without thinner", () =>
    expect(
      runStainDilution({
        stainParts: 1,
        stainVolumeL: 2,
        thinnerParts: 0,
      }),
    ).toEqual({
      ok: true,
      output: { dilutionRatio: 0, dilutedVolumeL: 2 },
    }));

  it("doubles the volume for equal parts", () =>
    expect(
      runStainDilution({
        stainParts: 1,
        stainVolumeL: 1.5,
        thinnerParts: 1,
      }),
    ).toEqual({
      ok: true,
      output: { dilutionRatio: 1, dilutedVolumeL: 3 },
    }));

  it("handles a strong one to nine dilution", () =>
    expect(
      runStainDilution({
        stainParts: 1,
        stainVolumeL: 2,
        thinnerParts: 9,
      }),
    ).toEqual({
      ok: true,
      output: { dilutionRatio: 9, dilutedVolumeL: 20 },
    }));

  it("scales the diluted volume with the stain volume", () =>
    expect(
      runStainDilution({
        stainParts: 3,
        stainVolumeL: 5,
        thinnerParts: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        dilutionRatio: 0.3333333333333333,
        dilutedVolumeL: 6.666666666666666,
      },
    }));

  it("accepts fractional part counts", () =>
    expect(
      runStainDilution({
        stainParts: 2.5,
        stainVolumeL: 2,
        thinnerParts: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { dilutionRatio: 0.2, dilutedVolumeL: 2.4 },
    }));

  it("rejects zero or negative stain parts", () => {
    for (const stainParts of [0, -3]) {
      const result = runStainDilution({
        stainParts,
        stainVolumeL: 2,
        thinnerParts: 1,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_stain_parts");
    }
  });

  it("rejects a zero or negative stain volume", () => {
    for (const stainVolumeL of [0, -2]) {
      const result = runStainDilution({
        stainParts: 3,
        stainVolumeL,
        thinnerParts: 1,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_stain_volume");
    }
  });

  it("rejects negative thinner parts through schema bounds", () => {
    const result = runStainDilution({
      stainParts: 3,
      stainVolumeL: 2,
      thinnerParts: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
  });

  it("rejects missing thinner parts", () => {
    const result = runStainDilution({ stainParts: 3, stainVolumeL: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite input", () =>
    expect(
      runStainDilution({
        stainParts: 3,
        stainVolumeL: Number.NaN,
        thinnerParts: 1,
      }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () =>
    expect(
      runStainDilution({
        stainParts: 3,
        stainVolumeL: 2,
        thinnerParts: 1,
        extra: 1,
      } as never).ok,
    ).toBe(false));
});
