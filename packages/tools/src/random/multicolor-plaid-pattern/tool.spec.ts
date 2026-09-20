import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  multicolorPlaidPatternExample as example,
  calculateMulticolorPlaidPattern,
} from "./tool.js";

describe("Random Multicolor Plaid Pattern Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMulticolorPlaidPattern(example.input)).toEqual({
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
  it("has an independently known encoded black/white crossing midpoint", () => {
    const draws = [0, 0xffffff / 0x1000000, 0, 0, 0, 0, 0, 0.9, 0, 0.9];
    let i = 0;
    const result = tool.execute(
      {
        verticalStripeCount: 2,
        horizontalStripeCount: 2,
        colorCount: 2,
        minimumStripeWidth: 1,
        maximumStripeWidth: 1,
      },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.intersectionColors).toEqual([
      ["#808080", "#808080"],
      ["#808080", "#808080"],
    ]);
    expect(result.output.tileWidth).toBe(2);
    expect(result.output.tileHeight).toBe(2);
  });
  it("retains stripe and palette indices, dimensions and finite exact extents", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    const out = result.output;
    expect(out.intersectionColors).toHaveLength(2);
    expect(out.intersectionColors[0]).toHaveLength(3);
    expect(out.tileWidth).toBe(
      out.verticalStripes.reduce((s, stripe) => s + stripe.width, 0),
    );
    expect(out.tileHeight).toBe(
      out.horizontalStripes.reduce((s, stripe) => s + stripe.width, 0),
    );
    for (const stripe of [...out.verticalStripes, ...out.horizontalStripes])
      expect(stripe.colorIndex).toBeLessThan(3);
    expect(
      tool.execute({
        ...example.input,
        minimumStripeWidth: Number.MAX_SAFE_INTEGER,
        maximumStripeWidth: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumStripeWidth", code: "unsafe_aggregate" }],
      },
    });
  });
});
