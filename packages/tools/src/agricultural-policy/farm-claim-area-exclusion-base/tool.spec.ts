import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agricultural-policy/farm-claim-area-exclusion-base", () => {
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
        claimedArea: 80,
        excludedArea: 10,
        sharedExclusion: 0,
        secondExclusion: 0,
      }),
    ).toEqual({ ok: true, output: { eligibleArea: 70, excludedUnion: 10 } });
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
    "rejects nonfinite claimedArea",
    (value) =>
      expect(tool.execute({ ...example.input, claimedArea: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedArea",
    (value) =>
      expect(tool.execute({ ...example.input, excludedArea: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sharedExclusion",
    (value) =>
      expect(
        tool.execute({ ...example.input, sharedExclusion: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondExclusion",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondExclusion: value }).ok,
      ).toBe(false),
  );
  it.each([
    { claimedArea: -1 },
    { excludedArea: -1 },
    { sharedExclusion: -1 },
    { secondExclusion: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { claimedArea: -1 },
    { excludedArea: -1 },
    { sharedExclusion: -1 },
    { secondExclusion: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
