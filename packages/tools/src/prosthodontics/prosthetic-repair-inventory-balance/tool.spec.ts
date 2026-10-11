import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("prosthodontics/prosthetic-repair-inventory-balance", () => {
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
        openingUnits: 2,
        receivedUnits: 0,
        usedUnits: 3,
        discardedUnits: 0,
      }),
    ).toEqual({ ok: true, output: { closingUnits: -1 } });
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
    "rejects nonfinite openingUnits",
    (value) =>
      expect(tool.execute({ ...example.input, openingUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receivedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, receivedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite usedUnits", (value) =>
    expect(tool.execute({ ...example.input, usedUnits: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite discardedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, discardedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { openingUnits: -1 },
    { receivedUnits: -1 },
    { usedUnits: -1 },
    { discardedUnits: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { openingUnits: -1 },
    { receivedUnits: -1 },
    { usedUnits: -1 },
    { discardedUnits: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 77 reviewed regressions", () => {
  it("preserves exact cancellation at the safe-integer boundary", () => {
    expect(
      calculate({
        openingUnits: Number.MAX_SAFE_INTEGER,
        receivedUnits: 2,
        usedUnits: Number.MAX_SAFE_INTEGER,
        discardedUnits: 0,
      }),
    ).toEqual({ closingUnits: 2 });
  });
  it("rejects an unsafe final count", () => {
    expect(
      tool.execute({
        openingUnits: Number.MAX_SAFE_INTEGER,
        receivedUnits: 1,
        usedUnits: 0,
        discardedUnits: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "result_out_of_range" }],
      },
    });
  });
});
