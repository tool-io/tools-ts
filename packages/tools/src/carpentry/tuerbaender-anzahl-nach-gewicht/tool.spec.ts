import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateTuerbaenderAnzahlNachGewicht,
  example,
} from "./tool.js";

describe("carpentry/tuerbaender-anzahl-nach-gewicht", () => {
  it("matches its worked example", () => {
    expect(calculateTuerbaenderAnzahlNachGewicht(example.input)).toEqual(
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
      tool.execute({ ...example.input, doorKilograms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative doorKilograms", () => {
    expect(tool.execute({ ...example.input, doorKilograms: -1 }).ok).toBe(
      false,
    );
  });
});
