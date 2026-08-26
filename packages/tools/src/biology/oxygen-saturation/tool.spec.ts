import { describe, expect, it } from "vitest";
import { oxygenSaturationExample, runOxygenSaturation } from "./tool.js";

describe("O2 Saturation Category", () => {
  it("publishes an executable example", () =>
    expect(runOxygenSaturation(oxygenSaturationExample.input)).toEqual({
      ok: true,
      output: oxygenSaturationExample.output,
    }));
  it("classifies hypoxemic below ninety percent", () =>
    expect(runOxygenSaturation({ spo2Percent: 89 })).toEqual({
      ok: true,
      output: { category: "hypoxemic" },
    }));
  it("classifies the ninety percent boundary as borderline", () =>
    expect(runOxygenSaturation({ spo2Percent: 90 })).toEqual({
      ok: true,
      output: { category: "borderline" },
    }));
  it("classifies borderline up to ninety-four percent", () =>
    expect(runOxygenSaturation({ spo2Percent: 94 })).toEqual({
      ok: true,
      output: { category: "borderline" },
    }));
  it("classifies the ninety-five percent boundary as normal", () =>
    expect(runOxygenSaturation({ spo2Percent: 95 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("classifies the lowest supported value as hypoxemic", () =>
    expect(runOxygenSaturation({ spo2Percent: 50 })).toEqual({
      ok: true,
      output: { category: "hypoxemic" },
    }));
  it("classifies full saturation as normal", () =>
    expect(runOxygenSaturation({ spo2Percent: 100 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("rejects values outside fifty to one hundred", () => {
    expect(runOxygenSaturation({ spo2Percent: 49 }).ok).toBe(false);
    expect(runOxygenSaturation({ spo2Percent: 101 }).ok).toBe(false);
  });
  it("rejects missing inputs", () =>
    expect(runOxygenSaturation({}).ok).toBe(false));
});
