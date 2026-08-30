import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDripEdgeLength, example } from "./tool.js";

describe("construction/drip-edge-length", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateDripEdgeLength(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, eaveLengthM: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, eaveLengthM: 0 })).toEqual({
      ok: true,
      output: { dripEdgeLengthM: 13.200000000000001 },
    });
  });
});
