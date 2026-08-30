import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDecimalMinutesScale, example } from "./tool.js";

describe("horology/decimal-minutes-scale", () => {
  it("matches its worked example", () => {
    expect(calculateDecimalMinutesScale(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, elapsedSeconds: Number.NaN }).ok,
    ).toBe(false);
  });
});
