import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCircularBufferIndex, example } from "./tool.js";

describe("microcontroller/circular-buffer-index", () => {
  it("matches its worked example", () => {
    expect(calculateCircularBufferIndex(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, headIndex: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative headIndex", () => {
    expect(tool.execute({ ...example.input, headIndex: -1 }).ok).toBe(false);
  });
  it("preserves exact wraparound near the safe-integer limit", () => {
    expect(
      tool.execute({
        headIndex: Number.MAX_SAFE_INTEGER - 2,
        offset: 5,
        capacity: Number.MAX_SAFE_INTEGER,
      }),
    ).toEqual({
      ok: true,
      output: { wrappedIndex: 3 },
    });
  });
});
