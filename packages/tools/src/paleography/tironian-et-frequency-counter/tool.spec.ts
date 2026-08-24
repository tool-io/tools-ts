import { describe, expect, it } from "vitest";
import {
  runTironianEtFrequencyCounter,
  tironianEtFrequencyCounterExample,
} from "./tool.js";

describe("tironian-et-frequency-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTironianEtFrequencyCounter(tironianEtFrequencyCounterExample.input),
    ).toEqual({ ok: true, output: tironianEtFrequencyCounterExample.output });
  });

  it("counts no signs in plain prose", () => {
    const result = runTironianEtFrequencyCounter({
      text: "quod erat demonstrandum",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.tironianEtCount as number).toBe(0);
    expect(result.output.standaloneEtTokenCount as number).toBe(0);
  });

  it("rejects empty text", () => {
    expect(runTironianEtFrequencyCounter({ text: "   " }).ok).toBe(false);
  });

  it("counts standalone et tokens followed by punctuation", () => {
    const result = runTironianEtFrequencyCounter({ text: "et, non et." });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.standaloneEtTokenCount).toBe(2);
  });
});
