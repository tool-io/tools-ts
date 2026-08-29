import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateNfcCouplingCoefficient, example } from "./tool.js";

describe("electronics/nfc-coupling-coefficient", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateNfcCouplingCoefficient(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, mutualInductanceHenries: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{
        mutualInductanceHenries: 1e308,
        primaryInductanceHenries: 1e308,
        secondaryInductanceHenries: 1e308,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.couplingCoefficient / 1).toBeCloseTo(1, 8);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      mutualInductanceHenries: 1,
      primaryInductanceHenries: 0.00001,
      secondaryInductanceHenries: 0.00001,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "mutualInductanceHenries" }],
      },
    });
  });
});
