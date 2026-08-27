import { describe, expect, it } from "vitest";
import { runI2cPullupResistorMin } from "./tool.js";
describe("I2C Pullup Min", () => {
  it("uses defaults for VOL and sink current", () =>
    expect(runI2cPullupResistorMin({ vddVolts: 5 })).toEqual({
      ok: true,
      output: { minPullupOhms: 1533.3333333333333 },
    }));
  it("scales with VDD at fixed levels", () =>
    expect(
      runI2cPullupResistorMin({
        vddVolts: 3.3,
        volMaxV: 0.4,
        sinkCurrentMa: 3,
      }),
    ).toEqual({
      ok: true,
      output: { minPullupOhms: 966.6666666666666 },
    }));
  it("supports a custom sink current", () =>
    expect(
      runI2cPullupResistorMin({
        vddVolts: 1.8,
        volMaxV: 0.4,
        sinkCurrentMa: 2,
      }),
    ).toEqual({
      ok: true,
      output: { minPullupOhms: 700 },
    }));
  it("rejects VDD at or below the low level", () => {
    const result = runI2cPullupResistorMin({ vddVolts: 0.4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_levels");
  });
  it("rejects a zero sink current", () =>
    expect(runI2cPullupResistorMin({ vddVolts: 5, sinkCurrentMa: 0 }).ok).toBe(
      false,
    ));
  it("rejects a negative sink current", () =>
    expect(runI2cPullupResistorMin({ vddVolts: 5, sinkCurrentMa: -3 }).ok).toBe(
      false,
    ));
});
