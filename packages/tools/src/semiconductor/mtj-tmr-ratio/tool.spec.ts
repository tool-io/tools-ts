import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMtjTmrRatio, example } from "./tool.js";

describe("semiconductor/mtj-tmr-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateMtjTmrRatio(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, antiparallelOhms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative antiparallelOhms", () => {
    expect(tool.execute({ ...example.input, antiparallelOhms: -1 }).ok).toBe(
      false,
    );
  });
});
