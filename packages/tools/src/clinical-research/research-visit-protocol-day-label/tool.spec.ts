import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("clinical-research/research-visit-protocol-day-label", () => {
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
        referenceDate: "2026-11-01",
        visitDate: "2026-10-31",
        referenceIsDayOne: true,
      }),
    ).toEqual({ ok: true, output: { protocolDay: -1, label: "Day -1" } });
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
  it("rejects malformed calendar text for visitDate", () => {
    const input = { ...example.input, visitDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "visitDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for visitDate", () => {
    const input = { ...example.input, visitDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "visitDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for visitDate", () => {
    const input = { ...example.input, visitDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "visitDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for referenceDate", () => {
    const input = { ...example.input, referenceDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "referenceDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for referenceDate", () => {
    const input = { ...example.input, referenceDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "referenceDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for referenceDate", () => {
    const input = { ...example.input, referenceDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "referenceDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        referenceDate: "2026-11-01",
        visitDate: "2026-11-01",
        referenceIsDayOne: false,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { protocolDay: 0, label: "Day 0" },
    });
    expect(calculate(input)).toEqual({ protocolDay: 0, label: "Day 0" });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        referenceDate: "2026-11-01",
        visitDate: "2026-11-01",
        referenceIsDayOne: true,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { protocolDay: 1, label: "Day 1" },
    });
    expect(calculate(input)).toEqual({ protocolDay: 1, label: "Day 1" });
  });
});
