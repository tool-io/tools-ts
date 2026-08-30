import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRramReadWindow, example } from "./tool.js";

describe("semiconductor/rram-read-window", () => {
  it("matches its worked example", () => {
    expect(calculateRramReadWindow(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, highStateOhms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative highStateOhms", () => {
    expect(tool.execute({ ...example.input, highStateOhms: -1 }).ok).toBe(
      false,
    );
  });
});
