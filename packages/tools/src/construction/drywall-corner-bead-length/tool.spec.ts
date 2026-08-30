import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDrywallCornerBeadLength, example } from "./tool.js";

describe("construction/drywall-corner-bead-length", () => {
  it("matches its worked example", () => {
    expect(calculateDrywallCornerBeadLength(example.input)).toEqual(
      example.output,
    );
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
      tool.execute({ ...example.input, netCornerMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative netCornerMeters", () => {
    expect(tool.execute({ ...example.input, netCornerMeters: -1 }).ok).toBe(
      false,
    );
  });
});
