import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateWoodFillerVolume, example } from "./tool.js";

describe("carpentry/wood-filler-volume", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateWoodFillerVolume(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, cavityLengthMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, cavityLengthMm: 0 })).toEqual({
      ok: true,
      output: { fillerVolumeLiters: 0 },
    });
  });
});
