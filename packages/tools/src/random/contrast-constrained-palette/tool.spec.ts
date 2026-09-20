import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  contrastConstrainedPaletteExample as example,
  calculateContrastConstrainedPalette,
} from "./tool.js";

describe("Random Contrast-Constrained Palette Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateContrastConstrainedPalette(example.input)).toEqual({
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
  it("checks known black/gray candidates against white without copying the imported contrast tool", () => {
    const draws = [0, 0x777777 / 0x1000000];
    let i = 0;
    const result = tool.execute(
      {
        count: 2,
        background: "#FFFFFF",
        minimumContrast: 4,
        maximumAttempts: 2,
      },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.colors).toEqual(["#000000", "#777777"]);
    expect(result.output.contrastRatios[0]).toBe(21);
    expect(result.output.contrastRatios[1]).toBeCloseTo(4.478089453577214, 12);
  });
  it("retains threshold-valid colors and reports exhausted and malformed requests", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    for (const ratio of result.output.contrastRatios)
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    const { seed, ...input } = example.input;
    expect(
      tool.execute({ ...input, maximumAttempts: 5 }, { random: () => 0.999 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "palette_search_exhausted", field: "maximumAttempts" },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, background: "#FFFFFF\n" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "background" }] },
    });
    expect(
      tool.execute({ ...example.input, maximumAttempts: 2 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "insufficient_attempt_budget" }] },
    });
  });
});
