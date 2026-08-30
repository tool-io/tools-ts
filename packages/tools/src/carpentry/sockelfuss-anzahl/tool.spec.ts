import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSockelfussAnzahl, example } from "./tool.js";

describe("carpentry/sockelfuss-anzahl", () => {
  it("matches its worked example", () => {
    expect(calculateSockelfussAnzahl(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, cabinetLengthMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative cabinetLengthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, cabinetLengthMillimeters: -1 }).ok,
    ).toBe(false);
  });
  it("rejects a zero-length cabinet", () => {
    expect(
      tool.execute({ ...example.input, cabinetLengthMillimeters: 0 }).ok,
    ).toBe(false);
  });
});
