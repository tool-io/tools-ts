import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("microbiology/microscopy-field-overlap-count-adjustment", () => {
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
        firstCount: 20,
        secondCount: 20,
        matchedOverlapCount: 10,
        firstArea: 1,
        secondArea: 1,
        overlapArea: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { uniqueCount: 30, unionArea: 1.5, density: 20 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstCount", (value) =>
    expect(tool.execute({ ...example.input, firstCount: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondCount",
    (value) =>
      expect(tool.execute({ ...example.input, secondCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite matchedOverlapCount",
    (value) =>
      expect(
        tool.execute({ ...example.input, matchedOverlapCount: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstArea", (value) =>
    expect(tool.execute({ ...example.input, firstArea: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite secondArea", (value) =>
    expect(tool.execute({ ...example.input, secondArea: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite overlapArea",
    (value) =>
      expect(tool.execute({ ...example.input, overlapArea: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstCount: -1 },
    { secondCount: -1 },
    { matchedOverlapCount: -1 },
    { firstArea: 0 },
    { secondArea: 0 },
    { overlapArea: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstCount: -1 },
    { secondCount: -1 },
    { matchedOverlapCount: -1 },
    { firstArea: 0 },
    { secondArea: 0 },
    { overlapArea: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
