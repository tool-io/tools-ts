import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  quantityParsingCorpusExample as example,
  calculateQuantityParsingCorpus as calculate,
} from "./tool.js";

describe("random/quantity-parsing-corpus", () => {
  it("matches its independently specified canonical literal and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves observations, replays, and gives explicit seed precedence", () => {
    const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.parse(JSON.stringify(input)) as typeof input;
    expect(calculate(input)).toEqual(calculate(input));
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Explicit seed must take precedence");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    expect(input).toEqual(before);
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    let draws = 0;
    const result = tool.execute(unseeded, {
      random: () => {
        draws += 1;
        return draws % 2 ? 0.2 : 0.7;
      },
    });
    if (!result.ok) throw new Error("Expected context-source success");
    expect(draws).toBeGreaterThan(0);
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
    expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(true);
    let repeated = 0;
    expect(
      tool.execute(unseeded, {
        random: () => {
          repeated += 1;
          return repeated % 2 ? 0.2 : 0.7;
        },
      }),
    ).toEqual(result);
  });
  it("reports invalid and throwing injected random sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_random_source", field: "random" }],
        },
      });
    expect(
      calculate(input, {
        random: () => {
          throw new Error("Injected source failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("rejects malformed, extra, inherited, and nonfinite input fields", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Expected missing-field rejection");
    const requiredFields = ["units", "minimumWhole", "maximumWhole", "count"];
    expect(missing.error.code).toBe("invalid_input");
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ code, field }) => ({ code, field })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ code: "required_field", field })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    expect(calculate(Object.create(example.input))).toMatchObject({
      ok: false,
    });
    const numericField = Object.entries(example.input).find(
      ([field, value]) => field !== "seed" && typeof value === "number",
    );
    if (numericField)
      expect(
        tool.execute({ ...example.input, [numericField[0]]: NaN }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: numericField[0] }] },
      });
    if (Object.hasOwn(example.input, "count"))
      expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "count" }] },
      });
    const arrayField = Object.entries(example.input).find(([, value]) =>
      Array.isArray(value),
    );
    if (arrayField)
      expect(
        tool.execute({ ...example.input, [arrayField[0]]: Array(1) }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: arrayField[0] }] },
      });
  });
  it("preserves caller unit spellings and independently normalizes inches", () => {
    const r = tool.execute(
      { units: ["°C"], minimumWhole: 5, maximumWhole: 5, count: 1 },
      { random: () => 0.2 },
    );
    if (!r.ok) throw new Error("Expected success");
    expect(r.output.cases[0]).toMatchObject({
      text: "5.2 °C",
      value: 5.2,
      unit: "°C",
    });
    expect(r.output.cases[4].value).toBe(62);
    expect(tool.execute({ ...example.input, units: ["123"] })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsupported_unit_spelling", field: "units" }],
      },
    });
  });
});
