import { describe, expect, it } from "vitest";
import {
  ectomycorrhizaMantleThicknessRaterExample,
  runEctomycorrhizaMantleThicknessRater,
} from "./tool.js";

describe("Mantle Thickness Rater", () => {
  const thresholds = { thickMinimumUm: 30.1, thinMaximumUm: 9.9 };
  it("matches the canonical example", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater(
        ectomycorrhizaMantleThicknessRaterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ectomycorrhizaMantleThicknessRaterExample.output,
    }));
  it("grades sub-ten-micrometre mantles as thin", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({
        ...thresholds,
        thicknessUm: 9.9,
      }),
    ).toEqual({
      ok: true,
      output: { mantleGrade: "thin" },
    }));
  it("grades ten micrometres as moderate", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({ ...thresholds, thicknessUm: 10 }),
    ).toEqual({
      ok: true,
      output: { mantleGrade: "moderate" },
    }));
  it("grades thirty micrometres as moderate", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({ ...thresholds, thicknessUm: 30 }),
    ).toEqual({
      ok: true,
      output: { mantleGrade: "moderate" },
    }));
  it("grades just above thirty micrometres as thick", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({
        ...thresholds,
        thicknessUm: 30.1,
      }),
    ).toEqual({
      ok: true,
      output: { mantleGrade: "thick" },
    }));
  it("grades very thick mantles as thick", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({
        ...thresholds,
        thicknessUm: 250,
      }),
    ).toEqual({
      ok: true,
      output: { mantleGrade: "thick" },
    }));
  it("rejects zero thickness", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({ ...thresholds, thicknessUm: 0 })
        .ok,
    ).toBe(false));
  it("rejects negative thickness", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({ ...thresholds, thicknessUm: -5 })
        .ok,
    ).toBe(false));
  it("rejects overlapping thresholds", () =>
    expect(
      runEctomycorrhizaMantleThicknessRater({
        thickMinimumUm: 10,
        thinMaximumUm: 10,
        thicknessUm: 20,
      }).ok,
    ).toBe(false));
});
