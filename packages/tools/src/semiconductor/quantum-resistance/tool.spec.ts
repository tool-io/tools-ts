import { describe, expect, it } from "vitest";
import { quantumResistanceExample, runQuantumResistance } from "./tool.js";

describe("Quantum Resistance Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runQuantumResistance(quantumResistanceExample.input)).toEqual({
      ok: true,
      output: quantumResistanceExample.output,
    }));

  it("halves the resistance for two channels", () =>
    expect(runQuantumResistance({ channelCount: 2 })).toEqual({
      ok: true,
      output: { resistanceOhms: 12906.403729652257 },
    }));

  it("divides into three equal channels", () => {
    const result = runQuantumResistance({ channelCount: 3 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.resistanceOhms).toBeCloseTo(
      25812.807459304513 / 3,
      9,
    );
  });

  it("defaults to a single channel when omitted", () =>
    expect(runQuantumResistance({})).toEqual({
      ok: true,
      output: { resistanceOhms: 25812.807459304513 },
    }));

  it("keeps the resistance-channel product constant", () => {
    const one = runQuantumResistance({ channelCount: 7 });
    const two = runQuantumResistance({ channelCount: 14 });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect((one.output.resistanceOhms as number) * 7).toBeCloseTo(
      (two.output.resistanceOhms as number) * 14,
      6,
    );
  });

  it("accepts large channel counts", () =>
    expect(runQuantumResistance({ channelCount: 1000 }).ok).toBe(true));

  it("rejects zero channels through schema validation", () =>
    expect(runQuantumResistance({ channelCount: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects negative channels", () =>
    expect(runQuantumResistance({ channelCount: -3 }).ok).toBe(false));

  it("rejects non-integer channels", () =>
    expect(
      runQuantumResistance({
        channelCount: 1.5,
      }).ok,
    ).toBe(false));

  it("rejects non-finite channels", () =>
    expect(runQuantumResistance({ channelCount: Number.NaN }).ok).toBe(false));
});
