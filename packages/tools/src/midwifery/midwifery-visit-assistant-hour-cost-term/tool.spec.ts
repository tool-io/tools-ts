import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("midwifery/midwifery-visit-assistant-hour-cost-term", () => {
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
        leadMinutes: 30,
        assistantMinutes: 30,
        leadHourly: 40,
        assistantHourly: 20,
        reimbursed: 0,
      }),
    ).toEqual({
      ok: true,
      output: { gross: 30, net: 30, assistantShare: 0.5 },
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
    "rejects nonfinite leadMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, leadMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite assistantMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, assistantMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite leadHourly", (value) =>
    expect(tool.execute({ ...example.input, leadHourly: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite assistantHourly",
    (value) =>
      expect(
        tool.execute({ ...example.input, assistantHourly: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite reimbursed", (value) =>
    expect(tool.execute({ ...example.input, reimbursed: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { leadMinutes: -1 },
    { assistantMinutes: -1 },
    { leadHourly: -1 },
    { assistantHourly: -1 },
    { reimbursed: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { leadMinutes: -1 },
    { assistantMinutes: -1 },
    { leadHourly: -1 },
    { assistantHourly: -1 },
    { reimbursed: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
