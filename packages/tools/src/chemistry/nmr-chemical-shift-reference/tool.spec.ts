import { describe, expect, it } from "vitest";
import {
  runChemicalShiftReference,
  chemicalShiftReferenceExample,
} from "./tool.js";
describe("Shift Relative To Reference", () => {
  it("publishes an executable example", () =>
    expect(
      runChemicalShiftReference(chemicalShiftReferenceExample.input),
    ).toEqual({ ok: true, output: chemicalShiftReferenceExample.output }));
  it("returns zero for the reference frequency itself", () =>
    expect(
      runChemicalShiftReference({
        sampleFrequencyHz: 600000000,
        referenceFrequencyHz: 600000000,
      }),
    ).toEqual({ ok: true, output: { chemicalShiftPpm: 0 } }));
  it("supports negative shifts on a lower frequency", () =>
    expect(
      runChemicalShiftReference({
        sampleFrequencyHz: 100000000 - 200,
        referenceFrequencyHz: 100000000,
      }),
    ).toEqual({ ok: true, output: { chemicalShiftPpm: -2 } }));
  it("rejects a zero reference frequency", () =>
    expect(
      runChemicalShiftReference({
        sampleFrequencyHz: 400000100,
        referenceFrequencyHz: 0,
      }).ok,
    ).toBe(false));
  it("rejects a negative reference frequency", () =>
    expect(
      runChemicalShiftReference({
        sampleFrequencyHz: 400000100,
        referenceFrequencyHz: -1,
      }).ok,
    ).toBe(false));
});
