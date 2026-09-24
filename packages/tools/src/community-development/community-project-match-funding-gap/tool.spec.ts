import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("community-development/community-project-match-funding-gap", () => {
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
        eligibleCost: 1000,
        suppliedMatchFraction: 0.25,
        securedMatch: 100,
        pledgedMatch: 50,
        countPledges: false,
      }),
    ).toEqual({ ok: true, output: { requiredMatch: 250, gap: 150 } });
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
    "rejects nonfinite eligibleCost",
    (value) =>
      expect(tool.execute({ ...example.input, eligibleCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedMatchFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedMatchFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite securedMatch",
    (value) =>
      expect(tool.execute({ ...example.input, securedMatch: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pledgedMatch",
    (value) =>
      expect(tool.execute({ ...example.input, pledgedMatch: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { eligibleCost: -1 },
    { suppliedMatchFraction: -1 },
    { suppliedMatchFraction: 2 },
    { securedMatch: -1 },
    { pledgedMatch: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { eligibleCost: -1 },
    { suppliedMatchFraction: -1 },
    { suppliedMatchFraction: 2 },
    { securedMatch: -1 },
    { pledgedMatch: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
