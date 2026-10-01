import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("occupational-therapy/home-task-workspace-clearance-gap", () => {
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
        openingWidth: 80,
        objectWidth: 70,
        handMargin: 5,
        alignmentUncertainty: 1,
      }),
    ).toEqual({
      ok: true,
      output: { nominalClearance: 10, usableClearance: -2, fits: false },
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite openingWidth",
    (value) =>
      expect(tool.execute({ ...example.input, openingWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite objectWidth",
    (value) =>
      expect(tool.execute({ ...example.input, objectWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite handMargin", (value) =>
    expect(tool.execute({ ...example.input, handMargin: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite alignmentUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, alignmentUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([
    { openingWidth: -1 },
    { objectWidth: -1 },
    { handMargin: -1 },
    { alignmentUncertainty: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { openingWidth: -1 },
    { objectWidth: -1 },
    { handMargin: -1 },
    { alignmentUncertainty: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
