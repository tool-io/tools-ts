import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacoepidemiology/prescription-coverage-end-date", () => {
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
    expect(tool.execute({ startDate: "2024-02-28", suppliedDays: 2 })).toEqual({
      ok: true,
      output: { inclusiveEndDate: "2024-02-29" },
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
    "rejects nonfinite suppliedDays",
    (value) =>
      expect(tool.execute({ ...example.input, suppliedDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ suppliedDays: 0 }])(
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
  it.each([{ suppliedDays: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("rejects malformed calendar text for startDate", () => {
    const input = { ...example.input, startDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "startDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for startDate", () => {
    const input = { ...example.input, startDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "startDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for startDate", () => {
    const input = { ...example.input, startDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "startDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ startDate: "0000-02-28", suppliedDays: 2 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { inclusiveEndDate: "0000-02-29" },
    });
    expect(calculate(input)).toEqual({ inclusiveEndDate: "0000-02-29" });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ startDate: "9999-12-31", suppliedDays: 2 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedDays", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
