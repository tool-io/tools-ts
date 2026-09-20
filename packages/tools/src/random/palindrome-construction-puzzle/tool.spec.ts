import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  palindromeConstructionPuzzleExample as example,
  calculatePalindromeConstructionPuzzle,
} from "./tool.js";

describe("Random Palindrome Construction Puzzle Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePalindromeConstructionPuzzle(example.input)).toEqual({
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
  it("mirrors odd and even arrangements and returns a concrete completion for every hidden position", () => {
    for (const unitCount of [1, 2, 9, 64])
      for (const mode of ["characters", "words"] as const) {
        const result = tool.execute({
          ...example.input,
          mode,
          units:
            mode === "characters"
              ? ["A", "b", "7"]
              : ["Level", "civic", "radar"],
          unitCount,
          hiddenCount: unitCount,
        });
        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        const out = result.output;
        expect(out.solutionUnits).toHaveLength(unitCount);
        expect(out.solutionUnits).toEqual([...out.solutionUnits].reverse());
        expect(out.checkerVerified).toBe(true);
        expect(out.puzzleUnits).toEqual(Array(unitCount).fill(null));
        expect(out.hiddenIndices).toEqual(
          Array.from({ length: unitCount }, (_, i) => i),
        );
        const normalized = out.solutionText
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        expect(normalized).toBe([...normalized].reverse().join(""));
      }
  });
  it("retains visible positions and distinct hidden indices without asserting a unique answer", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected puzzle");
    result.output.puzzleUnits.forEach((unit, i) =>
      expect(unit).toBe(
        result.output.hiddenIndices.includes(i)
          ? null
          : result.output.solutionUnits[i],
      ),
    );
  });
  it("rejects unsupported character units, nonpalindromic words and impossible hiding", () => {
    for (const change of [
      { mode: "characters", units: ["aa"] },
      { units: ["hello"] },
      { units: ["radar\n"] },
      { hiddenCount: 8 },
      { units: ["😀"] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
