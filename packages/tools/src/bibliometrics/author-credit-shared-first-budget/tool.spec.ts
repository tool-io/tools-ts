import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bibliometrics/author-credit-shared-first-budget", () => {
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
        totalCredit: 1,
        firstRoleShare: 0.6,
        sharedFirstAuthors: 3,
        otherAuthors: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        eachFirst: 0.19999999999999998,
        eachOther: 0,
        unallocated: 0.4,
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
    "rejects nonfinite totalCredit",
    (value) =>
      expect(tool.execute({ ...example.input, totalCredit: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstRoleShare",
    (value) =>
      expect(tool.execute({ ...example.input, firstRoleShare: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sharedFirstAuthors",
    (value) =>
      expect(
        tool.execute({ ...example.input, sharedFirstAuthors: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite otherAuthors",
    (value) =>
      expect(tool.execute({ ...example.input, otherAuthors: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { totalCredit: -1 },
    { firstRoleShare: -1 },
    { firstRoleShare: 2 },
    { sharedFirstAuthors: 0 },
    { otherAuthors: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { totalCredit: -1 },
    { firstRoleShare: -1 },
    { firstRoleShare: 2 },
    { sharedFirstAuthors: 0 },
    { otherAuthors: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
