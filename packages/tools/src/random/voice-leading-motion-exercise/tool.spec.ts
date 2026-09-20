import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  voiceLeadingMotionExerciseExample as example,
  calculateVoiceLeadingMotionExercise,
} from "./tool.js";

describe("random/voice-leading-motion-exercise", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateVoiceLeadingMotionExercise(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = [
      "count",
      "midiRange",
      "maximumLeapSemitones",
      "lowerVoiceIsBass",
    ];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("independently recognizes generated motion and the F-sharp/A minor third", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected exercise");
    expect(r.output.exercises[0].twoVoiceMotionClass).toBe("similar");
    expect(r.output.exercises[0].after.spelledSimpleIntervalNumber).toBe(3);
    for (let seed = 0; seed < 16; seed++) {
      const q = tool.execute({ ...example.input, count: 8, seed });
      if (!q.ok) throw new Error("Expected exercise");
      for (const e of q.output.exercises) {
        expect(
          Math.abs(e.firstVoiceMidiPair[1] - e.firstVoiceMidiPair[0]),
        ).toBeLessThanOrEqual(2);
        expect(
          Math.abs(e.secondVoiceMidiPair[1] - e.secondVoiceMidiPair[0]),
        ).toBeLessThanOrEqual(2);
      }
    }
  });
  it("supports static motion and rejects an unsupported interval span", () => {
    const r = tool.execute({ ...example.input, maximumLeapSemitones: 0 });
    if (!r.ok) throw new Error("Expected static");
    expect(r.output.exercises[0].twoVoiceMotionClass).toBe("static");
    expect(
      tool.execute({
        ...example.input,
        midiRange: { minimum: 0, maximum: 127 },
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsupported_interval_span", field: "midiRange" }],
      },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
  });
});
