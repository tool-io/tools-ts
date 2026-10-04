import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("vertical-farming/vertical-farm-light-dli-duty-factor", () => {
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
    expect(tool.execute({ ppfd: 100, hours: 12, dutyFraction: 1 })).toEqual({
      ok: true,
      output: { dliMolesPerM2: 4.32 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ppfd", (value) =>
    expect(tool.execute({ ...example.input, ppfd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite hours", (value) =>
    expect(tool.execute({ ...example.input, hours: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dutyFraction",
    (value) =>
      expect(tool.execute({ ...example.input, dutyFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { ppfd: -1 },
    { hours: -1 },
    { hours: 25 },
    { dutyFraction: -1 },
    { dutyFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { ppfd: -1 },
    { hours: -1 },
    { hours: 25 },
    { dutyFraction: -1 },
    { dutyFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 68 regression review

it("integrates a full constant-light day and rejects a longer day", () => {
  expect(calculate({ ppfd: 200, hours: 24, dutyFraction: 1 })).toEqual({
    dliMolesPerM2: 17.28,
  });
  expect(tool.execute({ ppfd: 200, hours: 25, dutyFraction: 1 })).toMatchObject(
    { ok: false, error: { code: "invalid_input" } },
  );
});
