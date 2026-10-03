import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("public-health/service-coverage-boundary-weight-term", () => {
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
        interiorPopulation: 80,
        boundaryPopulation: 20,
        coveredInterior: 40,
        coveredBoundary: 10,
        boundaryWeight: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        weightedPopulation: 80,
        weightedCovered: 40,
        coverage: 0.5,
        defined: true,
      },
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
    "rejects nonfinite interiorPopulation",
    (value) =>
      expect(
        tool.execute({ ...example.input, interiorPopulation: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite boundaryPopulation",
    (value) =>
      expect(
        tool.execute({ ...example.input, boundaryPopulation: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coveredInterior",
    (value) =>
      expect(
        tool.execute({ ...example.input, coveredInterior: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coveredBoundary",
    (value) =>
      expect(
        tool.execute({ ...example.input, coveredBoundary: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite boundaryWeight",
    (value) =>
      expect(tool.execute({ ...example.input, boundaryWeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { interiorPopulation: -1 },
    { boundaryPopulation: -1 },
    { coveredInterior: -1 },
    { coveredBoundary: -1 },
    { boundaryWeight: -1 },
    { boundaryWeight: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { interiorPopulation: -1 },
    { boundaryPopulation: -1 },
    { coveredInterior: -1 },
    { coveredBoundary: -1 },
    { boundaryWeight: -1 },
    { boundaryWeight: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
