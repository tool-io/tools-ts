import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSprayTipFanWidth, example } from "./tool.js";

describe("carpentry/spray-tip-fan-width", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateSprayTipFanWidth(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, standoffDistanceMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain boundary", () => {
    expect(
      tool.execute({ ...example.input, fullFanAngleDegrees: 1000000 }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, standoffDistanceMm: 0 })).toEqual({
      ok: true,
      output: { geometricFanWidthMm: 0 },
    });
  });
});
