import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFrequencyToNearestMidi, example } from "./tool.js";

describe("music/frequency-to-nearest-midi", () => {
  it("matches its worked example", () => {
    expect(calculateFrequencyToNearestMidi(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("moves by one octave when frequency doubles", () => {
    expect(tool.execute({ frequencyHertz: 880 })).toEqual({
      ok: true,
      output: { midiNote: 81 },
    });
    expect(tool.execute({ frequencyHertz: 220 })).toEqual({
      ok: true,
      output: { midiNote: 57 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, frequencyHertz: Number.NaN }).ok,
    ).toBe(false);
  });
});
