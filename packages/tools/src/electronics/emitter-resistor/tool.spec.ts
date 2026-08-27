import { describe, expect, it } from "vitest";
import { runEmitterResistor } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runEmitterResistor>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runEmitterResistor>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Emitter Resistor Value", () => {
  it("computes the emitter resistor in ohms", () =>
    expect(
      runEmitterResistor({ emitterCurrentMa: 2, emitterVolts: 1 }),
    ).toEqual({
      ok: true,
      output: { emitterResistorOhms: 500 },
    }));
  it("computes the emitter resistor for a 0.7V bias point", () =>
    expect(
      output(runEmitterResistor({ emitterCurrentMa: 1, emitterVolts: 0.7 }))
        .emitterResistorOhms,
    ).toBeCloseTo(700, 9));
  it("computes the emitter resistor at higher current", () =>
    expect(
      output(runEmitterResistor({ emitterCurrentMa: 5, emitterVolts: 2.5 }))
        .emitterResistorOhms,
    ).toBeCloseTo(500, 9));
  it("rejects a zero emitter voltage", () => {
    const result = runEmitterResistor({ emitterCurrentMa: 2, emitterVolts: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative emitter voltage", () =>
    expect(
      runEmitterResistor({ emitterCurrentMa: 2, emitterVolts: -1 }).ok,
    ).toBe(false));
  it("rejects a zero emitter current", () => {
    const result = runEmitterResistor({ emitterCurrentMa: 0, emitterVolts: 1 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative emitter current", () =>
    expect(
      runEmitterResistor({ emitterCurrentMa: -2, emitterVolts: 1 }).ok,
    ).toBe(false));
});
