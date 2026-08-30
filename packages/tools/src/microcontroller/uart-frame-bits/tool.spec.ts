import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateUartFrameBits, example } from "./tool.js";

describe("microcontroller/uart-frame-bits", () => {
  it("matches its worked example", () => {
    expect(calculateUartFrameBits(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, startBits: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative startBits", () => {
    expect(tool.execute({ ...example.input, startBits: -1 }).ok).toBe(false);
  });
});
