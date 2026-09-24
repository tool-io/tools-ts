import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-linguistics/dependency-projectivity-crossing-flag", () => {
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
        firstHead: 1,
        firstDependent: 4,
        secondHead: 2,
        secondDependent: 3,
      }),
    ).toEqual({ ok: true, output: { crosses: false } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstHead", (value) =>
    expect(tool.execute({ ...example.input, firstHead: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstDependent",
    (value) =>
      expect(tool.execute({ ...example.input, firstDependent: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite secondHead", (value) =>
    expect(tool.execute({ ...example.input, secondHead: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondDependent",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondDependent: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstHead: 3 },
    { firstHead: -1 },
    { firstDependent: -1 },
    { secondHead: -1 },
    { secondDependent: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstHead: 3 },
    { firstHead: -1 },
    { firstDependent: -1 },
    { secondHead: -1 },
    { secondDependent: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 72 independent regressions", () => {
  it("keeps shared endpoints from counting as crossings", () => {
    const input = {
      firstHead: 1,
      firstDependent: 3,
      secondHead: 3,
      secondDependent: 5,
    };
    expect(calculate(input)).toEqual({ crosses: false });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { crosses: false },
    });
  });
  it("detects crossing arcs regardless of their head direction", () => {
    const input = {
      firstHead: 4,
      firstDependent: 2,
      secondHead: 3,
      secondDependent: 1,
    };
    expect(calculate(input)).toEqual({ crosses: true });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { crosses: true },
    });
  });
});
