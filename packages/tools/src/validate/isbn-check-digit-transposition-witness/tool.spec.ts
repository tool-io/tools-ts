import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("validate/isbn-check-digit-transposition-witness", () => {
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
      tool.execute({ digits: "9780306406157", firstIndex: 0, secondIndex: 2 }),
    ).toEqual({
      ok: true,
      output: {
        swapped: "8790306406157",
        originalValid: true,
        swappedValid: true,
        undetected: true,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstIndex", (value) =>
    expect(tool.execute({ ...example.input, firstIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondIndex",
    (value) =>
      expect(tool.execute({ ...example.input, secondIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { digits: "9780306406157\n" },
    { firstIndex: 2, secondIndex: 2 },
    { firstIndex: -1 },
    { firstIndex: 13 },
    { secondIndex: -1 },
    { secondIndex: 13 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { digits: "9780306406157\n" },
    { firstIndex: 2, secondIndex: 2 },
    { firstIndex: -1 },
    { firstIndex: 13 },
    { secondIndex: -1 },
    { secondIndex: 13 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("retains an undetected same-weight transposition without claiming ISBN allocation", () => {
  expect(
    calculate({ digits: "9780306406157", firstIndex: 0, secondIndex: 2 }),
  ).toEqual({
    swapped: "8790306406157",
    originalValid: true,
    swappedValid: true,
    undetected: true,
  });
});
