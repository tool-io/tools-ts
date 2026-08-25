import { describe, expect, it } from "vitest";
import {
  hartignetDepthGradeClassifierExample,
  runHartignetDepthGradeClassifier,
} from "./tool.js";

describe("Hartig Net Grade", () => {
  const thresholds = {
    deepMinimumUm: 20.1,
    superficialMaximumUm: 4.9,
  };
  it("matches the canonical example", () =>
    expect(
      runHartignetDepthGradeClassifier(
        hartignetDepthGradeClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hartignetDepthGradeClassifierExample.output,
    }));
  it("grades shallow penetration as superficial", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 4.9 }),
    ).toEqual({
      ok: true,
      output: { hartigNetGrade: "superficial" },
    }));
  it("grades five micrometres as typical", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 5 }),
    ).toEqual({
      ok: true,
      output: { hartigNetGrade: "typical" },
    }));
  it("grades twenty micrometres as typical", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 20 }),
    ).toEqual({
      ok: true,
      output: { hartigNetGrade: "typical" },
    }));
  it("grades just above twenty micrometres as deep", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 20.1 }),
    ).toEqual({
      ok: true,
      output: { hartigNetGrade: "deep" },
    }));
  it("grades extensive penetration as deep", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 80 }),
    ).toEqual({
      ok: true,
      output: { hartigNetGrade: "deep" },
    }));
  it("rejects zero depth", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: 0 }).ok,
    ).toBe(false));
  it("rejects negative depth", () =>
    expect(
      runHartignetDepthGradeClassifier({ ...thresholds, depthUm: -2 }).ok,
    ).toBe(false));
  it("rejects overlapping thresholds", () =>
    expect(
      runHartignetDepthGradeClassifier({
        deepMinimumUm: 5,
        depthUm: 8,
        superficialMaximumUm: 5,
      }).ok,
    ).toBe(false));
});
