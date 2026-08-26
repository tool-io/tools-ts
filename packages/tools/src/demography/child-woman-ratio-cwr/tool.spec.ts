import { describe, expect, it } from "vitest";
import {
  calculateChildWomanRatioCwr,
  runChildWomanRatioCwr,
  childWomanRatioCwrExample,
} from "./tool.js";

describe("demography/child-woman-ratio-cwr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runChildWomanRatioCwr(childWomanRatioCwrExample.input)).toEqual({
      ok: true,
      output: childWomanRatioCwrExample.output,
    });
  });

  it("gives zero when no children are present", () => {
    expect(
      calculateChildWomanRatioCwr({ childrenUnderFive: 0, women15to49: 8000 }),
    ).toEqual({
      childWomanRatio: 0,
    });
  });

  it("rejects non-positive women or negative children", () => {
    expect(
      runChildWomanRatioCwr({ childrenUnderFive: 10, women15to49: 0 }).ok,
    ).toBe(false);
    expect(
      runChildWomanRatioCwr({ childrenUnderFive: -10, women15to49: 100 }).ok,
    ).toBe(false);
  });
});
