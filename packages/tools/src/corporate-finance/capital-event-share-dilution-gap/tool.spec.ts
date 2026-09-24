import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("corporate-finance/capital-event-share-dilution-gap", () => {
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
        heldBefore: 20,
        outstandingBefore: 100,
        issued: 100,
        acquired: 20,
        suppliedExpectedOwnership: 0.2,
      }),
    ).toEqual({
      ok: true,
      output: {
        ownershipBefore: 0.2,
        ownershipAfter: 0.2,
        dilution: 0,
        expectationGap: 0,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite heldBefore", (value) =>
    expect(tool.execute({ ...example.input, heldBefore: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite outstandingBefore",
    (value) =>
      expect(
        tool.execute({ ...example.input, outstandingBefore: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite issued", (value) =>
    expect(tool.execute({ ...example.input, issued: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite acquired", (value) =>
    expect(tool.execute({ ...example.input, acquired: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedExpectedOwnership",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedExpectedOwnership: value }).ok,
      ).toBe(false),
  );
  it.each([
    { heldBefore: -1 },
    { outstandingBefore: 0 },
    { issued: -1 },
    { acquired: -1 },
    { suppliedExpectedOwnership: -1 },
    { suppliedExpectedOwnership: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { heldBefore: -1 },
    { outstandingBefore: 0 },
    { issued: -1 },
    { acquired: -1 },
    { suppliedExpectedOwnership: -1 },
    { suppliedExpectedOwnership: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
