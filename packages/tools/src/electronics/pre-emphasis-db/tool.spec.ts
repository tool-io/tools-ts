import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePreEmphasisDb, example } from "./tool.js";

describe("electronics/pre-emphasis-db", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePreEmphasisDb(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, emphasizedAmplitudeV: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain boundary", () => {
    expect(tool.execute({ ...example.input, emphasizedAmplitudeV: 0 }).ok).toBe(
      false,
    );
  });
  it("rejects attenuation presented as pre-emphasis", () => {
    expect(
      tool.execute({ ...example.input, emphasizedAmplitudeV: 0.5 }).ok,
    ).toBe(false);
  });
});
