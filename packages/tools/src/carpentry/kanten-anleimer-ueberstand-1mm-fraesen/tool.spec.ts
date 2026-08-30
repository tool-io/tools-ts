import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateKantenAnleimerUeberstand1mmFraesen,
  example,
} from "./tool.js";

describe("carpentry/kanten-anleimer-ueberstand-1mm-fraesen", () => {
  it("matches its worked example", () => {
    expect(calculateKantenAnleimerUeberstand1mmFraesen(example.input)).toEqual(
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
      tool.execute({ ...example.input, panelThicknessMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative panelThicknessMm", () => {
    expect(tool.execute({ ...example.input, panelThicknessMm: -1 }).ok).toBe(
      false,
    );
  });
});
