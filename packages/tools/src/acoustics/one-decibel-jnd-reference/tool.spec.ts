import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  example,
  lookupJustNoticeableLevelDifference1dbReference,
} from "./tool.js";

describe("acoustics/one-decibel-jnd-reference", () => {
  it("matches its canonical example", () => {
    expect(lookupJustNoticeableLevelDifference1dbReference()).toEqual(
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

  it("does not turn 1 dB into a universal JND", () => {
    expect(example.output.nominalDifferenceDecibels).toBe(1);
    expect(example.output.universalJustNoticeableDifference).toBe(false);
    expect(example.output.requiredContext).toEqual(
      expect.arrayContaining([
        expect.stringContaining("stimulus"),
        expect.stringContaining("listener"),
        expect.stringContaining("procedure"),
      ]),
    );
  });

  it("rejects missing, malformed, and unknown inputs", () => {
    expect(tool.execute(null).ok).toBe(false);
    expect(tool.execute({ referenceDecibels: 1 }).ok).toBe(false);
  });
});
