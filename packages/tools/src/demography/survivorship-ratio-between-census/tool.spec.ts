import { describe, expect, it } from "vitest";
import {
  calculateSurvivorshipRatioBetweenCensus,
  runSurvivorshipRatioBetweenCensus,
  survivorshipRatioBetweenCensusExample,
} from "./tool.js";

describe("demography/survivorship-ratio-between-census", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSurvivorshipRatioBetweenCensus(
        survivorshipRatioBetweenCensusExample.input,
      ),
    ).toEqual({
      ok: true,
      output: survivorshipRatioBetweenCensusExample.output,
    });
  });

  it("yields one when mortality is absent between the ages", () => {
    expect(
      calculateSurvivorshipRatioBetweenCensus({ lxStart: 9000, lxLater: 9000 }),
    ).toEqual({
      survivalRatio: 1,
    });
  });

  it("rejects a non-positive starting value", () => {
    expect(
      runSurvivorshipRatioBetweenCensus({ lxStart: 0, lxLater: 1 }).ok,
    ).toBe(false);
    expect(
      runSurvivorshipRatioBetweenCensus({ lxStart: 10, lxLater: 11 }).ok,
    ).toBe(false);
  });
});
