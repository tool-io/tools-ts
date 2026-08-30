import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBphToHertz, example } from "./tool.js";

describe("horology/bph-to-hertz", () => {
  it("matches its worked example", () => {
    expect(calculateBphToHertz(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("maps 28,800 beats per hour to four full oscillations per second", () => {
    expect(tool.execute({ beatsPerHour: 28800 })).toEqual({
      ok: true,
      output: { hertz: 4 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, beatsPerHour: Number.NaN }).ok,
    ).toBe(false);
  });
});
