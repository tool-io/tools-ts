import { describe, expect, it } from "vitest";
import { cardiacOutputExample, runCardiacOutput } from "./tool.js";

describe("Cardiac Output L/min", () => {
  it("publishes an executable example", () =>
    expect(runCardiacOutput(cardiacOutputExample.input)).toEqual({
      ok: true,
      output: cardiacOutputExample.output,
    }));
  it("computes 70 bpm x 70 mL to 4.9 L/min", () =>
    expect(runCardiacOutput({ heartRateBpm: 70, strokeVolumeMl: 70 })).toEqual({
      ok: true,
      output: { cardiacOutputLPerMin: 4.9 },
    }));
  it("computes another valid result", () =>
    expect(runCardiacOutput({ heartRateBpm: 120, strokeVolumeMl: 65 })).toEqual(
      {
        ok: true,
        output: { cardiacOutputLPerMin: 7.8 },
      },
    ));
  it("handles minimal positive inputs", () =>
    expect(runCardiacOutput({ heartRateBpm: 1, strokeVolumeMl: 1 })).toEqual({
      ok: true,
      output: { cardiacOutputLPerMin: 0.001 },
    }));
  it("rejects zero heart rate", () => {
    const result = runCardiacOutput({ heartRateBpm: 0, strokeVolumeMl: 70 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative stroke volume", () => {
    const result = runCardiacOutput({ heartRateBpm: 70, strokeVolumeMl: -5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects non-finite input", () => {
    const result = runCardiacOutput({
      heartRateBpm: Number.POSITIVE_INFINITY,
      strokeVolumeMl: 70,
    });
    expect(result.ok).toBe(false);
  });
});
