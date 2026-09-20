import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  selectorSpecificityQuizExample as example,
  calculateSelectorSpecificityQuiz,
} from "./tool.js";

describe("random/selector-specificity-quiz", () => {
  it("requires exact-end ASCII identifiers in every bank", () => {
    for (const field of ["typeNames", "classNames", "idNames"] as const)
      for (const identifier of ["article\n", "card\r\n", "éclair", "two words"])
        expect(
          tool.execute({ ...example.input, [field]: [identifier] }),
        ).toMatchObject({
          ok: false,
          error: { issues: [{ code: "invalid_field", field }] },
        });
  });
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateSelectorSpecificityQuiz(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = [
      "templates",
      "typeNames",
      "classNames",
      "idNames",
      "count",
    ];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("uses an independent specificity answer for zeroed where and direct IDs", () => {
    expect(example.output.questions.map((x) => x.specificity)).toEqual([
      { ids: 0, classes: 1, types: 1 },
      { ids: 1, classes: 2, types: 1 },
    ]);
    const r = tool.execute({
      ...example.input,
      templates: ["{type}.{class}#{id}:hover"],
      count: 1,
    });
    if (!r.ok) throw new Error("Expected quiz");
    expect(r.output.questions[0].specificity).toEqual({
      ids: 1,
      classes: 2,
      types: 1,
    });
  });
  it("rejects nesting and unresolved placeholders before sampling", () => {
    expect(
      tool.execute({ ...example.input, templates: ["& .{class}"] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsupported_selector", field: "templates.0" }],
      },
    });
    expect(
      tool.execute({ ...example.input, templates: ["{unknown}"] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsupported_template", field: "templates.0" }],
      },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
  });
});
