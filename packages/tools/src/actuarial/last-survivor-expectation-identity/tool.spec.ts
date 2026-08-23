import { describe, expect, it } from "vitest";
import {
  calculateLastSurvivorExpectationIdentity,
  lastSurvivorExpectationIdentityExample,
  runLastSurvivorExpectationIdentity,
} from "./tool.js";

describe("last survivor expectation identity calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLastSurvivorExpectationIdentity(
        lastSurvivorExpectationIdentityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: lastSurvivorExpectationIdentityExample.output,
    });
  });

  it("exceeds both single-life expectancies", () => {
    const result = calculateLastSurvivorExpectationIdentity({
      firstLifeDeathProbability: 0.5,
      secondLifeDeathProbability: 0.9,
    });
    const first = 1 / -Math.log(0.5);
    const second = 1 / -Math.log(0.1);
    expect(result.expectedYears).toBeGreaterThan(first);
    expect(result.expectedYears).toBeGreaterThan(second);
  });

  it("rejects immortal lives and invalid inputs", () => {
    expect(
      runLastSurvivorExpectationIdentity({
        firstLifeDeathProbability: 0,
        secondLifeDeathProbability: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runLastSurvivorExpectationIdentity({
        firstLifeDeathProbability: 0,
        secondLifeDeathProbability: 0.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "series_diverges" }] },
      ok: false,
    });
    expect(
      runLastSurvivorExpectationIdentity({
        firstLifeDeathProbability: -1,
        secondLifeDeathProbability: 0,
      }).ok,
    ).toBe(false);
  });
});
