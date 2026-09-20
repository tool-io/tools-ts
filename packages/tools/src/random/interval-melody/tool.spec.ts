import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  intervalMelodyExample as example,
  calculateIntervalMelody,
} from "./tool.js";

describe("Random Bounded-Interval Melody Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateIntervalMelody(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("has independently known ascending semitones and bounds all generated jumps", () => {
    const result = tool.execute(
      {
        count: 3,
        minimumMidi: 69,
        maximumMidi: 71,
        startingMidi: 69,
        maximumStepSemitones: 1,
      },
      { random: () => 0.99 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.notes.map((note) => note.midi)).toEqual([69, 70, 71]);
    expect(result.output.signedIntervals).toEqual([1, 1]);
    for (let seed = 0; seed < 12; seed += 1) {
      const generated = tool.execute({ ...example.input, count: 100, seed });
      if (!generated.ok) throw new Error("Expected success");
      generated.output.notes.forEach((note, i) => {
        expect(note.midi).toBeGreaterThanOrEqual(60);
        expect(note.midi).toBeLessThanOrEqual(72);
        if (i) {
          expect(
            Math.abs(note.midi - generated.output.notes[i - 1].midi),
          ).toBeLessThanOrEqual(4);
          expect(generated.output.signedIntervals[i - 1]).toBe(
            note.midi - generated.output.notes[i - 1].midi,
          );
        }
      });
    }
  });
  it("supports a repeated-pitch melody and a single starting note, rejecting impossible starts", () => {
    const repeated = tool.execute({
      ...example.input,
      maximumStepSemitones: 0,
    });
    if (!repeated.ok) throw new Error("Expected success");
    expect(repeated.output.notes.every((note) => note.midi === 67)).toBe(true);
    const single = tool.execute({ ...example.input, count: 1 });
    if (!single.ok) throw new Error("Expected success");
    expect(single.output.signedIntervals).toEqual([]);
    expect(tool.execute({ ...example.input, startingMidi: 59 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "startingMidi", code: "start_outside_range" }],
      },
    });
    expect(tool.execute({ ...example.input, minimumMidi: 73 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumMidi", code: "invalid_pitch_range" }],
      },
    });
  });
});
