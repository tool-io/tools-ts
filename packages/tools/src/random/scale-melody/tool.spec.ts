import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  scaleMelodyExample as example,
  calculateScaleMelody,
} from "./tool.js";

describe("Random Scale-Constrained Melody Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateScaleMelody(example.input)).toEqual({
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
  it("checks the scale pool and has independently known A4/A5 frequencies", () => {
    const result = tool.execute(
      {
        count: 2,
        tonicPitchClass: 9,
        scaleOffsets: [0],
        minimumOctave: 4,
        maximumOctave: 5,
      },
      {
        random: (() => {
          let i = 0;
          return () => (i++ ? 0.99 : 0);
        })(),
      },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.availableMidi).toEqual([69, 81]);
    expect(result.output.notes).toEqual([
      { midi: 69, note: "A4", octave: 4, frequencyHz: 440 },
      { midi: 81, note: "A5", octave: 5, frequencyHz: 880 },
    ]);
    for (let seed = 0; seed < 12; seed += 1) {
      const generated = tool.execute({ ...example.input, count: 100, seed });
      if (!generated.ok) throw new Error("Expected success");
      for (const note of generated.output.notes)
        expect([60, 62, 64, 65, 67, 69, 71]).toContain(note.midi);
    }
  });
  it("handles MIDI's partial top octave and rejects impossible or ambiguous scale pools", () => {
    const result = tool.execute({
      count: 1,
      tonicPitchClass: 0,
      scaleOffsets: [0, 7],
      minimumOctave: 9,
      maximumOctave: 9,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.availableMidi).toEqual([120, 127]);
    expect(
      tool.execute({ ...example.input, scaleOffsets: [0, 0] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "scaleOffsets", code: "duplicate_scale_offsets" }],
      },
    });
    expect(tool.execute({ ...example.input, minimumOctave: 5 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumOctave" }] },
    });
    expect(
      tool.execute({
        count: 1,
        tonicPitchClass: 0,
        scaleOffsets: [11],
        minimumOctave: 9,
        maximumOctave: 9,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "empty_pitch_pool" }] },
    });
  });
});
