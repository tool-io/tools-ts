import { describe, expect, it } from "vitest";
import { cardiacPowerOutputExample, runCardiacPowerOutput } from "./tool.js";

describe("Cardiac Power Output", () => {
  it("publishes an executable example", () =>
    expect(runCardiacPowerOutput(cardiacPowerOutputExample.input)).toEqual({
      ok: true,
      output: cardiacPowerOutputExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runCardiacPowerOutput({
        cardiacOutputLPerMin: 4.5,
        meanArterialMmhg: 88,
      }),
    ).toEqual({
      ok: true,
      output: { cardiacPowerOutputWatts: 0.8791200000000001 },
    }));
  it("handles higher flow and pressure", () =>
    expect(
      runCardiacPowerOutput({
        cardiacOutputLPerMin: 6.5,
        meanArterialMmhg: 92,
      }),
    ).toEqual({
      ok: true,
      output: { cardiacPowerOutputWatts: 1.32756 },
    }));
  it("rejects zero cardiac output", () => {
    const result = runCardiacPowerOutput({
      cardiacOutputLPerMin: 0,
      meanArterialMmhg: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero mean arterial pressure", () => {
    const result = runCardiacPowerOutput({
      cardiacOutputLPerMin: 5,
      meanArterialMmhg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative inputs", () => {
    const result = runCardiacPowerOutput({
      cardiacOutputLPerMin: -5,
      meanArterialMmhg: 90,
    });
    expect(result.ok).toBe(false);
  });
});
