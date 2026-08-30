import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBrickWeightWall, example } from "./tool.js";

describe("construction/brick-weight-wall", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateBrickWeightWall(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, brickCount: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, brickCount: 0 })).toEqual({
      ok: true,
      output: { wallMassKg: 100 },
    });
  });
});
