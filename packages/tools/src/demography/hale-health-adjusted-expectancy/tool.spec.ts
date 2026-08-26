import { describe, expect, it } from "vitest";
import {
  haleHealthAdjustedExpectancyExample,
  runHaleHealthAdjustedExpectancy,
} from "./tool.js";

describe("hale-health-adjusted-expectancy", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHaleHealthAdjustedExpectancy(
        haleHealthAdjustedExpectancyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: haleHealthAdjustedExpectancyExample.output,
    });
  });

  it("equals life expectancy when everyone is fully healthy", () => {
    const r = runHaleHealthAdjustedExpectancy({
      lifeExpectancyYears: 80,
      expectedYearsInReducedHealth: 0,
    });
    expect(r.ok && r.output.haleYears).toBe(80);
  });

  it("rejects unhealthy years above life expectancy", () => {
    expect(
      runHaleHealthAdjustedExpectancy({
        lifeExpectancyYears: 50,
        expectedYearsInReducedHealth: 60,
      }).ok,
    ).toBe(false);
  });
});
