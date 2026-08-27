import { describe, expect, it } from "vitest";
import {
  runVentilationPerfusionMismatch,
  ventilationPerfusionMismatchExample,
} from "./tool.js";

describe("V/Q Mismatch Category", () => {
  it("publishes an executable example", () =>
    expect(
      runVentilationPerfusionMismatch(
        ventilationPerfusionMismatchExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ventilationPerfusionMismatchExample.output,
    }));
  it("classifies deep shunt", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 0.29 })).toEqual({
      ok: true,
      output: { mismatchCategory: "shunt" },
    }));
  it("classifies low ventilation at the upper shunt boundary", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 0.3 })).toEqual({
      ok: true,
      output: { mismatchCategory: "low" },
    }));
  it("classifies the top of the low band as low", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 0.8 })).toEqual({
      ok: true,
      output: { mismatchCategory: "low" },
    }));
  it("classifies just above the low band as normal", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 0.81 })).toEqual({
      ok: true,
      output: { mismatchCategory: "normal" },
    }));
  it("classifies the normal boundary as dead-space", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 1.5 })).toEqual({
      ok: true,
      output: { mismatchCategory: "dead-space" },
    }));
  it("accepts a zero ratio as shunt", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: 0 })).toEqual({
      ok: true,
      output: { mismatchCategory: "shunt" },
    }));
  it("rejects negative ratios", () =>
    expect(runVentilationPerfusionMismatch({ vqRatio: -0.1 }).ok).toBe(false));
});
