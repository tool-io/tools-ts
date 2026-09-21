import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroforestry/shelterbelt-gapedge-weight", () => {
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
        interiorLength: 50,
        gapEdgeLength: 10,
        suppliedEdgeWeight: 0,
        referenceLength: 100,
      }),
    ).toEqual({
      ok: true,
      output: { weightedLength: 50, referenceFraction: 0.5 },
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
    "rejects nonfinite interiorLength",
    (value) =>
      expect(tool.execute({ ...example.input, interiorLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gapEdgeLength",
    (value) =>
      expect(tool.execute({ ...example.input, gapEdgeLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedEdgeWeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedEdgeWeight: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceLength",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceLength: value }).ok,
      ).toBe(false),
  );
  it.each([
    { interiorLength: -1 },
    { gapEdgeLength: -1 },
    { suppliedEdgeWeight: -1 },
    { suppliedEdgeWeight: 2 },
    { referenceLength: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { interiorLength: -1 },
    { gapEdgeLength: -1 },
    { suppliedEdgeWeight: -1 },
    { suppliedEdgeWeight: 2 },
    { referenceLength: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
