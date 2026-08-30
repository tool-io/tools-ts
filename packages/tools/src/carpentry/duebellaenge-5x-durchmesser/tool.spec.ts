import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDuebellaenge5xDurchmesser, example } from "./tool.js";

describe("carpentry/duebellaenge-5x-durchmesser", () => {
  it("matches its worked example", () => {
    expect(calculateDuebellaenge5xDurchmesser(example.input)).toEqual(
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
      tool.execute({ ...example.input, diameterMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative diameterMillimeters", () => {
    expect(tool.execute({ ...example.input, diameterMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
