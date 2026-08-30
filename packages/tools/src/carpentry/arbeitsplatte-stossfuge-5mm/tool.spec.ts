import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateArbeitsplatteStossfuge5mm, example } from "./tool.js";

describe("carpentry/arbeitsplatte-stossfuge-5mm", () => {
  it("matches its worked example", () => {
    expect(calculateArbeitsplatteStossfuge5mm(example.input)).toEqual(
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
      tool.execute({ ...example.input, availableRunMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative availableRunMm", () => {
    expect(tool.execute({ ...example.input, availableRunMm: -1 }).ok).toBe(
      false,
    );
  });
});
