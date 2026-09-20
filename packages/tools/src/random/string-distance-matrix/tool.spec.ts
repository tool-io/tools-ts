import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  stringDistanceMatrixExample as example,
  calculateStringDistanceMatrix,
} from "./tool.js";

describe("Random String Distance Matrix Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateStringDistanceMatrix(example.input)).toEqual({
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
  it("replays actual code-point edits and maintains symmetric identity/distance matrices", () => {
    const result = tool.execute({
      sourceTexts: ["A😀B", ""],
      alphabet: ["😀", "x", "é"],
      count: 20,
      maximumMutations: 8,
      seed: 7,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const generated of result.output.strings) {
      const letters = [...generated.sourceText];
      for (const edit of generated.edits) {
        const length = [...edit.before].length;
        expect(letters.slice(edit.index, edit.index + length).join("")).toBe(
          edit.before,
        );
        letters.splice(edit.index, length, ...edit.after);
      }
      expect(letters.join("")).toBe(generated.text);
    }
    for (let i = 0; i < 20; i += 1)
      for (let j = 0; j < 20; j += 1) {
        expect(result.output.levenshtein[i][j]).toBe(
          result.output.levenshtein[j][i],
        );
        expect(result.output.optimalStringAlignment[i][j]).toBe(
          result.output.optimalStringAlignment[j][i],
        );
        expect(result.output.identical[i][j]).toBe(
          result.output.strings[i].text === result.output.strings[j].text,
        );
        expect(result.output.levenshtein[i][j] === 0).toBe(
          result.output.identical[i][j],
        );
        expect(result.output.optimalStringAlignment[i][j]).toBeLessThanOrEqual(
          result.output.levenshtein[i][j],
        );
      }
    expect(JSON.parse(result.output.matricesJson.levenshtein)).toEqual(
      result.output.levenshtein,
    );
  });
  it("retains duplicate identities and empty strings without pretending mutation counts are distances", () => {
    expect(
      tool.execute({
        ...example.input,
        sourceTexts: [""],
        maximumMutations: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        levenshtein: Array.from({ length: 4 }, () => [0, 0, 0, 0]),
        identical: Array.from({ length: 4 }, () => [true, true, true, true]),
      },
    });
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.levenshtein[0][3]).toBe(2);
    if (result.ok) expect(result.output.optimalStringAlignment[0][3]).toBe(1);
  });
  it("rejects invalid alphabets, excess source code points, and resource bounds", () => {
    for (const change of [
      { alphabet: ["ab"] },
      { alphabet: ["\ud800"] },
      { alphabet: ["a", "a"] },
      { sourceTexts: ["a".repeat(65)] },
      { count: 33 },
      { maximumMutations: 9 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
