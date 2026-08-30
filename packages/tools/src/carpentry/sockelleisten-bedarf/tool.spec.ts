import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSockelleistenBedarf, example } from "./tool.js";

describe("carpentry/sockelleisten-bedarf", () => {
  it("matches its worked example", () => {
    expect(calculateSockelleistenBedarf(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, perimeterMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative perimeterMeters", () => {
    expect(tool.execute({ ...example.input, perimeterMeters: -1 }).ok).toBe(
      false,
    );
  });
});
