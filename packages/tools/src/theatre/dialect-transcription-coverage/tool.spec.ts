import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("produces the canonical result", () => {
    const expected = {
      coveragePercent: 66.66666666666666,
      matched: ["alpha", "beta"],
      missing: ["gamma"],
      unexpected: ["extra"],
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
