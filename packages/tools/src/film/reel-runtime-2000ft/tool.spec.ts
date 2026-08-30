import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateReelRuntime2000ft, example } from "./tool.js";

describe("film/reel-runtime-2000ft", () => {
  it("matches its worked example", () => {
    expect(calculateReelRuntime2000ft(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, framesPerFoot: Number.NaN }).ok,
    ).toBe(false);
  });
});
