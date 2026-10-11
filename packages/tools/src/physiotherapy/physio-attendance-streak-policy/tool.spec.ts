import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physiotherapy/physio-attendance-streak-policy", () => {
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
        scheduled: [true, true, false],
        attended: [true, true, false],
        unscheduledBreaksStreak: true,
      }),
    ).toEqual({ ok: true, output: { currentStreak: 0 } });
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
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        scheduled: [true, false, true],
        attended: [true, false, true],
        unscheduledBreaksStreak: false,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { currentStreak: 2 },
    });
    expect(calculate(input)).toEqual({ currentStreak: 2 });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ scheduled: [], attended: [], unscheduledBreaksStreak: true },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { currentStreak: 0 },
    });
    expect(calculate(input)).toEqual({ currentStreak: 0 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ attended: [] } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "attended", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
