import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hospital-pharmacy/expiry-reference-day-offset", () => {
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
        expiryDate: "2024-03-01",
        referenceDate: "2024-03-01",
        inclusiveExpiry: false,
      }),
    ).toEqual({ ok: true, output: { dayOffset: 0, currentUnderRule: false } });
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

describe("independently reviewed regressions", () => {
  it("an explicitly inclusive expiry day remains current", () => {
    const output = calculate({
      expiryDate: "2024-02-29",
      referenceDate: "2024-02-29",
      inclusiveExpiry: true,
    });
    expect(output).toMatchObject({ dayOffset: 0, currentUnderRule: true });
    expect(
      tool.execute({
        expiryDate: "2024-02-29",
        referenceDate: "2024-02-29",
        inclusiveExpiry: true,
      }),
    ).toEqual({ ok: true, output });
  });
  it("an explicitly exclusive expiry day is not current", () => {
    const output = calculate({
      expiryDate: "2024-02-29",
      referenceDate: "2024-02-29",
      inclusiveExpiry: false,
    });
    expect(output).toMatchObject({ dayOffset: 0, currentUnderRule: false });
    expect(
      tool.execute({
        expiryDate: "2024-02-29",
        referenceDate: "2024-02-29",
        inclusiveExpiry: false,
      }),
    ).toEqual({ ok: true, output });
  });
});
