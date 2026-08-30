import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateWorkbenchViseJawWidth, example } from "./tool.js";

describe("carpentry/workbench-vise-jaw-width", () => {
  it("matches its worked example", () => {
    expect(calculateWorkbenchViseJawWidth(example.input)).toEqual(
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
      tool.execute({ ...example.input, workpieceWidthMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative workpieceWidthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, workpieceWidthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
