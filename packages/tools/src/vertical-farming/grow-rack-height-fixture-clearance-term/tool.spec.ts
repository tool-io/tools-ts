import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("vertical-farming/grow-rack-height-fixture-clearance-term", () => {
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
        roomHeight: 4,
        shelfLevels: 4,
        shelfPitch: 0.8,
        base: 0.3,
        fixtureDepth: 0.2,
        topAllowance: 0.1,
      }),
    ).toEqual({ ok: true, output: { remainingClearance: 0.9999999999999999 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite roomHeight", (value) =>
    expect(tool.execute({ ...example.input, roomHeight: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite shelfLevels",
    (value) =>
      expect(tool.execute({ ...example.input, shelfLevels: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite shelfPitch", (value) =>
    expect(tool.execute({ ...example.input, shelfPitch: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite base", (value) =>
    expect(tool.execute({ ...example.input, base: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fixtureDepth",
    (value) =>
      expect(tool.execute({ ...example.input, fixtureDepth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite topAllowance",
    (value) =>
      expect(tool.execute({ ...example.input, topAllowance: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { roomHeight: -1 },
    { shelfLevels: 0 },
    { shelfPitch: -1 },
    { base: -1 },
    { fixtureDepth: -1 },
    { topAllowance: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { roomHeight: -1 },
    { shelfLevels: 0 },
    { shelfPitch: -1 },
    { base: -1 },
    { fixtureDepth: -1 },
    { topAllowance: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
