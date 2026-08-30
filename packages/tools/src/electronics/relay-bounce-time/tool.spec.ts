import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRelayBounceTime, example } from "./tool.js";

describe("electronics/relay-bounce-time", () => {
  it("matches its worked example", () => {
    expect(calculateRelayBounceTime(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, firstClosureMilliseconds: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
