import { describe, expect, it } from "vitest";
import {
  calculateSocialFluidityIndex,
  socialFluidityIndexGlassExample,
  socialFluidityIndexGlassTool,
  runSocialFluidityIndexGlass,
} from "./tool.js";

describe("socialFluidityIndexGlassTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSocialFluidityIndexGlass(socialFluidityIndexGlassExample.input),
    ).toEqual({
      ok: true,
      output: socialFluidityIndexGlassExample.output,
    });
  });

  it("computes the two-by-two class-association odds ratio", () => {
    expect(
      calculateSocialFluidityIndex({
        countsMatrix: [
          [8, 4],
          [2, 6],
        ],
      }),
    ).toEqual({ fluidityOddsRatio: 6 });
    const result = runSocialFluidityIndexGlass({
      countsMatrix: [
        [8, 0],
        [2, 6],
      ],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("countsMatrix");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(socialFluidityIndexGlassExample))).toEqual(
      socialFluidityIndexGlassExample,
    );
    expect(socialFluidityIndexGlassTool.contractVersion).toBe(1);
    expect(socialFluidityIndexGlassTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSocialFluidityIndexGlass(null).ok).toBe(false);
    expect(
      runSocialFluidityIndexGlass({
        ...socialFluidityIndexGlassExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
