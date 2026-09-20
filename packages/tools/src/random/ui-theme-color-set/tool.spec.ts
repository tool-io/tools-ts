import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  uiThemeColorSetExample as example,
  calculateUiThemeColorSet,
} from "./tool.js";

describe("Random UI Theme Color Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateUiThemeColorSet(example.input)).toEqual({
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
  it("has known white-background/black-accent roles and does not treat an accent as text automatically", () => {
    const result = tool.execute(
      {
        background: "#ffffff",
        minimumTextContrast: 4.5,
        minimumAccentContrast: 3,
        maximumAttempts: 2,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output).toMatchObject({
      background: "#FFFFFF",
      text: "#000000",
      accent: "#000000",
      onAccent: "#FFFFFF",
      textBackgroundContrast: 21,
      accentBackgroundContrast: 21,
      onAccentContrast: 21,
      attempts: 1,
    });
    const out = tool.execute(example.input);
    if (!out.ok) throw new Error("Expected success");
    expect(out.output.textBackgroundContrast).toBeGreaterThanOrEqual(4.5);
    expect(out.output.accentBackgroundContrast).toBeGreaterThanOrEqual(3);
    expect(out.output.onAccentContrast).toBeGreaterThanOrEqual(4.5);
  });
  it("reports impossible text policies and bounded accent-search failure", () => {
    expect(
      tool.execute({
        ...example.input,
        background: "#777777",
        minimumTextContrast: 21,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "minimumTextContrast", code: "infeasible_text_contrast" },
        ],
      },
    });
    const { seed, ...input } = example.input;
    expect(
      tool.execute({ ...input, maximumAttempts: 2 }, { random: () => 0.999 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "palette_search_exhausted" },
        ],
      },
    });
  });
});
