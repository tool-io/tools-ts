import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  identifierTranscriptionErrorCorpusExample as example,
  calculateIdentifierTranscriptionErrorCorpus,
} from "./tool.js";

describe("Random Identifier Transcription Error Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateIdentifierTranscriptionErrorCorpus(example.input)).toEqual({
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
  it("reconstructs every mutation and independently audits decimal check digits", () => {
    for (const operation of example.input.operations) {
      const result = tool.execute({
        ...example.input,
        operations: [operation],
        count: 40,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const row of result.output.cases) {
        expect(row.originalValidation.valid).toBe(true);
        expect(
          [...row.original].reduce(
            (sum, d, i) => sum + Number(d) * (i % 2 ? 3 : 1),
            0,
          ) % 10,
        ).toBe(0);
        expect(
          row.original.slice(row.position, row.position + row.before.length),
        ).toBe(row.before);
        expect(row.mutated).toBe(
          row.original.slice(0, row.position) +
            row.after +
            row.original.slice(row.position + row.before.length),
        );
        expect(row.changed).toBe(row.original !== row.mutated);
        if (operation === "substitution") {
          expect(row.changed).toBe(true);
          expect(row.mutatedValidation.valid).toBe(false);
        }
        if (operation === "deletion") expect(row.mutated).toHaveLength(12);
        if (operation === "transposition")
          expect(row.after).toBe([...row.before].reverse().join(""));
      }
    }
  });
  it("retains unchanged swaps as valid controls rather than claiming detection", () => {
    const result = tool.execute(
      { kinds: ["ean-13"], operations: ["transposition"], count: 1 },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            original: "0000000000000",
            mutated: "0000000000000",
            changed: false,
            mutatedValidation: { valid: true },
          },
        ],
      },
    });
  });
  it("keeps changed but checksum-preserving adjacent swaps observable", () => {
    const draws = [0, 0, 0.5, ...Array(10).fill(0), 0, 0];
    const result = tool.execute(
      { kinds: ["ean-13"], operations: ["transposition"], count: 1 },
      { random: () => draws.shift()! },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            original: "0500000000005",
            mutated: "5000000000005",
            changed: true,
            mutatedValidation: { valid: true },
          },
        ],
      },
    });
  });
  it("rejects unsupported families, mutations and resource sizes", () => {
    for (const change of [
      { kinds: [] },
      { kinds: ["ean-13", "ean-13"] },
      { operations: ["insertion"] },
      { count: 65 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
