import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  svgConstellationPatternExample as example,
  calculateSvgConstellationPattern,
} from "./tool.js";

describe("Random SVG Constellation Pattern Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSvgConstellationPattern(example.input)).toEqual({
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
  it("includes exactly the threshold-eligible unordered pairs", () => {
    for (const maximumLinkDistance of [0, 1, 4, 100]) {
      const result = tool.execute({
        ...example.input,
        nodeCount: 20,
        width: 20,
        height: 10,
        maximumLinkDistance,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const expected: { from: number; to: number }[] = [];
      for (let from = 0; from < result.output.nodes.length; from += 1)
        for (let to = from + 1; to < result.output.nodes.length; to += 1) {
          const first = result.output.nodes[from],
            last = result.output.nodes[to];
          if (
            Math.hypot(first.x - last.x, first.y - last.y) <=
            maximumLinkDistance
          )
            expected.push({ from, to });
        }
      expect(result.output.links.map(({ from, to }) => ({ from, to }))).toEqual(
        expected,
      );
      expect(result.output.totalLinkLength).toBeCloseTo(
        result.output.links.reduce((sum, link) => sum + link.distance, 0),
        10,
      );
    }
  });
  it("allows coincident nodes and rejects invalid canvas, threshold, and resource bounds", () => {
    const result = tool.execute({
      ...example.input,
      width: 2,
      height: 2,
      maximumLinkDistance: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        totalLinkLength: 0,
        links: [
          { from: 0, to: 1, distance: 0 },
          { from: 0, to: 2, distance: 0 },
          { from: 1, to: 2, distance: 0 },
        ],
      },
    });
    for (const change of [
      { width: 1 },
      { height: 2.5 },
      { nodeCount: 65 },
      { maximumLinkDistance: -1 },
      { maximumLinkDistance: Infinity },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
