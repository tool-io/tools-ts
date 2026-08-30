import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMomentInertiaRectangle, example } from "./tool.js";

describe("engineering/moment-inertia-rectangle", () => {
  it("matches its worked example", () => {
    expect(calculateMomentInertiaRectangle(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, widthMeters: Number.NaN }).ok).toBe(
      false,
    );
  });
});
