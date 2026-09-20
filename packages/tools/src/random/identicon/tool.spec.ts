import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  identiconExample as example,
  calculateIdenticon,
} from "./tool.js";

describe("Random Identicon Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateIdenticon(example.input)).toEqual({
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
  it("mirrors every row independently for odd and even dimensions", () => {
    for (const size of [2, 5, 6, 32]) {
      const result = tool.execute({ ...example.input, size });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.cells).toHaveLength(size);
      for (const row of result.output.cells) {
        expect(row).toHaveLength(size);
        expect(row).toEqual([...row].reverse());
      }
      expect((result.output.svg.match(/<rect /g) ?? []).length).toBe(
        size * size,
      );
      expect(result.output.svg).not.toMatch(
        /NaN|Infinity|undefined|script|href/,
      );
    }
  });
  it("supports explicit blank/solid endpoints and a bounded color-source failure", () => {
    for (const fillProbability of [0, 1]) {
      const result = tool.execute({ ...example.input, fillProbability });
      if (!result.ok) throw new Error("Expected success");
      expect(new Set(result.output.cells.flat())).toEqual(
        new Set([fillProbability]),
      );
    }
    const { seed, ...input } = example.input;
    expect(
      tool.execute(
        { ...input, background: "#000000", maximumAttempts: 3 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "palette_search_exhausted" },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, background: '#FFF" onload="x' }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "background" }] },
    });
  });
});
