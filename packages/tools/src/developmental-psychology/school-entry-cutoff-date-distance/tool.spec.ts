import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("developmental-psychology/school-entry-cutoff-date-distance", () => {
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
        suppliedCutoffDate: "2026-11-03",
        birthDate: "2026-11-01",
      }),
    ).toEqual({ ok: true, output: { signedCalendarDays: -2 } });
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
});

describe("reviewed boundary cases", () => {
  it("rejects malformed calendar text for birthDate", () => {
    const input = { ...example.input, birthDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "birthDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for birthDate", () => {
    const input = { ...example.input, birthDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "birthDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for birthDate", () => {
    const input = { ...example.input, birthDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "birthDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for suppliedCutoffDate", () => {
    const input = { ...example.input, suppliedCutoffDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedCutoffDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for suppliedCutoffDate", () => {
    const input = { ...example.input, suppliedCutoffDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedCutoffDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for suppliedCutoffDate", () => {
    const input = { ...example.input, suppliedCutoffDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedCutoffDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
