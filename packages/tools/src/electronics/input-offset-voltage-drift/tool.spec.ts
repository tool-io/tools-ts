import { describe, expect, it } from "vitest";
import { runInputOffsetVoltageDrift } from "./tool.js";

describe("Offset Drift", () => {
  it("calculates a valid result", () =>
    expect(
      runInputOffsetVoltageDrift({ offsetChangeUv: 50, temperatureDeltaC: 25 }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: 2 },
    }));
  it("keeps a negative offset change signed", () =>
    expect(
      runInputOffsetVoltageDrift({
        offsetChangeUv: -40,
        temperatureDeltaC: 20,
      }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: -2 },
    }));
  it("flips sign when cooling", () =>
    expect(
      runInputOffsetVoltageDrift({
        offsetChangeUv: 30,
        temperatureDeltaC: -15,
      }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: -2 },
    }));
  it("yields positive drift for negative change over cooling", () =>
    expect(
      runInputOffsetVoltageDrift({
        offsetChangeUv: -12,
        temperatureDeltaC: -6,
      }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: 2 },
    }));
  it("supports fractional drift", () =>
    expect(
      runInputOffsetVoltageDrift({ offsetChangeUv: 7.5, temperatureDeltaC: 3 }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: 2.5 },
    }));
  it("supports wide intervals", () =>
    expect(
      runInputOffsetVoltageDrift({
        offsetChangeUv: 250,
        temperatureDeltaC: 1000,
      }),
    ).toEqual({
      ok: true,
      output: { driftUvPerC: 0.25 },
    }));
  it("rejects a degenerate temperature interval", () => {
    const result = runInputOffsetVoltageDrift({
      offsetChangeUv: 10,
      temperatureDeltaC: 0,
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.issues[0]?.code).toBe(
      "degenerate_interval",
    );
  });
});
