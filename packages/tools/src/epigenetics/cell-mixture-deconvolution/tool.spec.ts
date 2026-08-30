import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";

describe(tool.id, () => {
  it("computes the canonical result", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("constrains an out-of-range mixture to a physical fraction", () => {
    expect(
      calculate({
        observedMarkerOne: 2,
        observedMarkerTwo: -1,
        cellAMarkerOne: 1,
        cellAMarkerTwo: 0,
        cellBMarkerOne: 0,
        cellBMarkerTwo: 1,
      }),
    ).toMatchObject({ cellAFraction: 1, cellBFraction: 0 });
    expect(
      tool.execute({
        ...example.input,
        cellAMarkerOne: 0,
        cellAMarkerTwo: 1,
        cellBMarkerOne: 0,
        cellBMarkerTwo: 1,
      }),
    ).toMatchObject({ ok: false });
  });
});
