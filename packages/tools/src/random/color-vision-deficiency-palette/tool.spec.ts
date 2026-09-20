import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  colorVisionDeficiencyPaletteExample as example,
  calculateColorVisionDeficiencyPalette,
} from "./tool.js";
import { oklab, simulate } from "../../color/spaces.js";

describe("Random Color Vision Deficiency Palette Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateColorVisionDeficiencyPalette(example.input)).toEqual({
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
  it("independently checks every reported pair and the requested threshold", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    const out = result.output,
      colors = out.colors;

    expect(new Set(colors).size).toBe(colors.length);
    const rgb = colors.map((hex) =>
      [1, 3, 5].map(
        (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
      ),
    );
    const labs = rgb.map((color) =>
      (["protan", "deutan", "tritan"] as const).map((type) =>
        oklab(simulate(color, type).simulatedRgb),
      ),
    );
    const distances: number[] = [];
    for (let i = 0; i < colors.length; i += 1)
      for (let j = i + 1; j < colors.length; j += 1) {
        const distance = Math.min(
          ...labs[i].map((lab, model) =>
            Math.sqrt(
              lab.reduce(
                (sum, x, axis) => sum + (x - labs[j][model][axis]) ** 2,
                0,
              ),
            ),
          ),
        );
        expect(out.pairDistances[i][j]).toBeCloseTo(distance, 14);
        expect(distance).toBeGreaterThanOrEqual(example.input.minimumDistance);
        expect(out.pairDistances[i][j]).toBe(out.pairDistances[j][i]);
        distances.push(distance);
      }
    expect(out.minimumPairDistance).toBe(
      Math.min(
        ...distances.map((_, k) => {
          const pairs = out.pairDistances.flatMap((row, i) => row.slice(i + 1));
          return pairs[k];
        }),
      ),
    );
    expect(out.attempts).toBeLessThanOrEqual(example.input.maximumAttempts);
  });
  it("enforces a finite search budget rather than hanging on an impossible or duplicate source", () => {
    const { seed, ...input } = example.input;
    expect(
      tool.execute({ ...input, maximumAttempts: 5 }, { random: () => 0 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "palette_search_exhausted" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumDistance: 10,
        maximumAttempts: 10,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "palette_search_exhausted" },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, maximumAttempts: 2 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "insufficient_attempt_budget" },
        ],
      },
    });
  });
});
