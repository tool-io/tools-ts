import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHolzfehlerKappungLaenge, example } from "./tool.js";

describe("carpentry/holzfehler-kappung-laenge", () => {
  it("matches its worked example", () => {
    expect(calculateHolzfehlerKappungLaenge(example.input)).toEqual(
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
      tool.execute({ ...example.input, boardLengthMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative boardLengthMm", () => {
    expect(tool.execute({ ...example.input, boardLengthMm: -1 }).ok).toBe(
      false,
    );
  });
});
