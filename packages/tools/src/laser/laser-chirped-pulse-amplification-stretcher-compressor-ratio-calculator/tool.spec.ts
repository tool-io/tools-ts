import { describe, expect, it } from "vitest";
import {
  cpaRatioExample as example,
  cpaStretchRatio,
  runCpaRatio,
} from "./tool.js";

describe("CPA stretch ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCpaRatio(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("scales linearly with the stretched duration", () => {
    const base = cpaStretchRatio({
      stretchedDurationPs: 100,
      compressedDurationFs: 100,
    }).stretchRatio;
    const doubled = cpaStretchRatio({
      stretchedDurationPs: 200,
      compressedDurationFs: 100,
    }).stretchRatio;
    expect(doubled).toBe(base * 2);
  });
  it("rejects non-positive durations", () => {
    expect(
      runCpaRatio({ stretchedDurationPs: 0, compressedDurationFs: 100 }).ok,
    ).toBe(false);
    expect(
      runCpaRatio({ stretchedDurationPs: 100, compressedDurationFs: -1 }).ok,
    ).toBe(false);
  });
});
