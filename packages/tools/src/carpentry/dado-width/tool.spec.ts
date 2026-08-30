import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDadoWidth, example } from "./tool.js";

describe("carpentry/dado-width", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateDadoWidth(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, panelThicknessMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, panelThicknessMm: 0 })).toEqual({
      ok: true,
      output: { dadoWidthMm: 0.2 },
    });
  });
});
