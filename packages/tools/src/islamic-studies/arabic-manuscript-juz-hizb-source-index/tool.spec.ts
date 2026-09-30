import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("islamic-studies/arabic-manuscript-juz-hizb-source-index", () => {
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
    expect(
      tool.execute({
        juz: 1,
        hizbWithinJuz: 2,
        subdivisionsPerHizb: 4,
        subdivision: 4,
      }),
    ).toEqual({ ok: true, output: { hizbIndex: 2, subdivisionIndex: 8 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite juz", (value) =>
    expect(tool.execute({ ...example.input, juz: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite hizbWithinJuz",
    (value) =>
      expect(tool.execute({ ...example.input, hizbWithinJuz: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite subdivisionsPerHizb",
    (value) =>
      expect(
        tool.execute({ ...example.input, subdivisionsPerHizb: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite subdivision",
    (value) =>
      expect(tool.execute({ ...example.input, subdivision: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { juz: 0 },
    { juz: 31 },
    { hizbWithinJuz: 0 },
    { hizbWithinJuz: 3 },
    { subdivisionsPerHizb: 0 },
    { subdivision: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { juz: 0 },
    { juz: 31 },
    { hizbWithinJuz: 0 },
    { hizbWithinJuz: 3 },
    { subdivisionsPerHizb: 0 },
    { subdivision: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
