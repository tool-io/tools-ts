import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTouchCapacitanceDelta, example } from "./tool.js";

describe("electronics/touch-capacitance-delta", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateTouchCapacitanceDelta(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, baselineCapacitancePf: Number.NaN }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(
      tool.execute({ ...example.input, baselineCapacitancePf: 0 }),
    ).toEqual({ ok: true, output: { capacitanceDeltaPf: 23 } });
  });
});
