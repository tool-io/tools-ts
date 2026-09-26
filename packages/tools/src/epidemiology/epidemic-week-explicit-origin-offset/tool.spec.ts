import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("epidemiology/epidemic-week-explicit-origin-offset", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(tool.execute({ day: 98, originDay: 100, daysPerWeek: 7 })).toEqual({
      ok: true,
      output: { weekIndex: -1, dayWithinWeek: 5 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite day", (value) =>
    expect(tool.execute({ ...example.input, day: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite originDay", (value) =>
    expect(tool.execute({ ...example.input, originDay: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite daysPerWeek",
    (value) =>
      expect(tool.execute({ ...example.input, daysPerWeek: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ daysPerWeek: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("preserves exact day subtraction and Euclidean remainder across signed safe endpoints", () => {
    expect(
      calculate({
        day: 9007199254740991,
        originDay: -9007199254740990,
        daysPerWeek: 7,
      }),
    ).toEqual({ weekIndex: 2573485501354568, dayWithinWeek: 5 });
    expect(
      calculate({
        day: -9007199254740991,
        originDay: 9007199254740991,
        daysPerWeek: 7,
      }),
    ).toEqual({ weekIndex: -2573485501354569, dayWithinWeek: 1 });
  });
  it.each([{ daysPerWeek: 0 }])(
    "reviewed-domain direct validation %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrow();
      const result = tool.execute({ ...example.input, ...change });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect([
          "invalid_field",
          "invalid_domain",
          "result_out_of_range",
        ]).toContain(result.error.issues[0].code);
    },
  );
});
