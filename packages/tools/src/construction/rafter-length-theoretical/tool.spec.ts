import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRafterLengthTheoretical, example } from "./tool.js";

describe("construction/rafter-length-theoretical", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateRafterLengthTheoretical(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, runM: Number.NaN }).ok).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, runM: 0 })).toEqual({
      ok: true,
      output: { rafterLengthM: 4 },
    });
  });
});
