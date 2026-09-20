import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  sequentialPatternMiningExample as example,
  calculateSequentialPatternMining,
} from "./tool.js";

describe("Sequential Pattern Mining Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSequentialPatternMining(example.input)).toEqual({
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
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("matches independently enumerated subsequences and sequence-level support", () => {
    const sequences = [["a", "a", "b"], ["b", "a", "b"], ["a", "b"], []];
    const all = new Map<string, { events: string[]; count: number }>();
    for (const sequence of sequences) {
      const unique = new Map<string, string[]>();
      for (let mask = 1; mask < 2 ** sequence.length; mask += 1) {
        const events = sequence.filter((_, i) => mask & (1 << i));
        unique.set(JSON.stringify(events), events);
      }
      for (const [key, events] of unique) {
        const entry = all.get(key) ?? { events, count: 0 };
        entry.count += 1;
        all.set(key, entry);
      }
    }
    const result = tool.execute({
      sequences,
      minimumCount: 2,
      maximumLength: 3,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(
      new Map(
        result.output.patterns.map((p) => [JSON.stringify(p.events), p.count]),
      ),
    ).toEqual(
      new Map(
        [...all]
          .filter(([, p]) => p.count >= 2)
          .map(([key, p]) => [key, p.count]),
      ),
    );
    for (const pattern of result.output.patterns)
      expect(pattern.support).toBe(pattern.count / 4);
  });
  it("counts arbitrary gaps, repeated events and empty databases correctly", () => {
    const result = tool.execute({
      sequences: [
        ["x", "x", "y"],
        ["x", "gap", "y"],
      ],
      minimumCount: 2,
      maximumLength: 3,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(
      result.output.patterns.find(
        (p) => JSON.stringify(p.events) === '["x","y"]',
      )?.count,
    ).toBe(2);
    expect(
      result.output.patterns.some(
        (p) => JSON.stringify(p.events) === '["x","x"]',
      ),
    ).toBe(false);
    expect(
      tool.execute({ sequences: [[], []], minimumCount: 1, maximumLength: 2 }),
    ).toEqual({ ok: true, output: { sequenceCount: 2, patterns: [] } });
    expect(
      tool.execute({
        sequences: [Array.from({ length: 17 }, (_, i) => String(i))],
        minimumCount: 1,
        maximumLength: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "sequences", code: "resource_limit" }] },
    });
    expect(
      tool.execute({
        sequences: [Array.from({ length: 16 }, (_, i) => String(i))],
        minimumCount: 1,
        maximumLength: 8,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
  });
});
