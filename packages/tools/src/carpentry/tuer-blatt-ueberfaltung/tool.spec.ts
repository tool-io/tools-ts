import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateTuerBlattUeberfaltung, example } from "./tool.js";

describe("carpentry/tuer-blatt-ueberfaltung", () => {
  it("matches its worked example", () => {
    expect(calculateTuerBlattUeberfaltung(example.input)).toEqual(
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
      tool.execute({ ...example.input, leafWidthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative leafWidthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, leafWidthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
