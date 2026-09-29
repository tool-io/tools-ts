import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("herpetology/reptile-molt-length-measurement-factor", () => {
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
        shedLength: 90,
        stretchFactor: 1.5,
        originalBodyLength: 80,
      }),
    ).toEqual({
      ok: true,
      output: { relaxedShedLength: 60, shedBodyRatio: 0.75 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite shedLength", (value) =>
    expect(tool.execute({ ...example.input, shedLength: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stretchFactor",
    (value) =>
      expect(tool.execute({ ...example.input, stretchFactor: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite originalBodyLength",
    (value) =>
      expect(
        tool.execute({ ...example.input, originalBodyLength: value }).ok,
      ).toBe(false),
  );
  it.each([
    { shedLength: -1 },
    { stretchFactor: 0 },
    { originalBodyLength: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { shedLength: -1 },
    { stretchFactor: 0 },
    { originalBodyLength: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
