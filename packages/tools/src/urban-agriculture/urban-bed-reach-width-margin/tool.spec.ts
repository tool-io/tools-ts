import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("urban-agriculture/urban-bed-reach-width-margin", () => {
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
        bedWidth: 100,
        reachFromEachSide: 60,
        accessibleSideCount: 1,
      }),
    ).toEqual({ ok: true, output: { reachMargin: -40 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bedWidth", (value) =>
    expect(tool.execute({ ...example.input, bedWidth: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reachFromEachSide",
    (value) =>
      expect(
        tool.execute({ ...example.input, reachFromEachSide: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite accessibleSideCount",
    (value) =>
      expect(
        tool.execute({ ...example.input, accessibleSideCount: value }).ok,
      ).toBe(false),
  );
  it.each([
    { bedWidth: -1 },
    { reachFromEachSide: -1 },
    { accessibleSideCount: 0 },
    { accessibleSideCount: 3 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { bedWidth: -1 },
    { reachFromEachSide: -1 },
    { accessibleSideCount: 0 },
    { accessibleSideCount: 3 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
