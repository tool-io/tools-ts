import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateZinkenTeilungBreiteGleichDicke,
  example,
} from "./tool.js";

describe("carpentry/zinken-teilung-breite-gleich-dicke", () => {
  it("matches its worked example", () => {
    expect(calculateZinkenTeilungBreiteGleichDicke(example.input)).toEqual(
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
      tool.execute({ ...example.input, jointLengthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative jointLengthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, jointLengthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
