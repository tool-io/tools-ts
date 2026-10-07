import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biophysics/channel-open-closed-dwell-pair", () => {
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
    expect(tool.execute({ openDwell: 5, closedDwell: 0 })).toEqual({
      ok: true,
      output: { cycleDuration: 5, openFraction: 1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite openDwell", (value) =>
    expect(tool.execute({ ...example.input, openDwell: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite closedDwell",
    (value) =>
      expect(tool.execute({ ...example.input, closedDwell: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ openDwell: -1 }, { closedDwell: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ openDwell: -1 }, { closedDwell: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = { ...example.input, ...{ openDwell: 0, closedDwell: 5 } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { cycleDuration: 5, openFraction: 0 },
    });
    expect(calculate(input)).toEqual({ cycleDuration: 5, openFraction: 0 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ openDwell: 0, closedDwell: 0 } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "closedDwell", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
