import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";

describe(tool.id, () => {
  it("produces the canonical result", () => {
    const expected = {
      coveragePercent: 75.0,
      matched: ["creator", "capture date", "rights holder"],
      missing: ["license"],
      unexpected: [],
    };
    expect(calculate(example.input)).toEqual(expected);
    expect(tool.execute(example.input)).toEqual({ ok: true, output: expected });
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and unknown input", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
});
