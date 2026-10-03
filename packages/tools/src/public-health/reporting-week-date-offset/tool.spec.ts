import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("public-health/reporting-week-date-offset", () => {
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
      tool.execute({ date: "2023-12-31", weekOrigin: "2024-01-01" }),
    ).toEqual({ ok: true, output: { days: -1, weekIndex: -1, offsetDays: 6 } });
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
  it("negative dates use a preceding week and positive day offset", () => {
    const output = calculate({ date: "2023-12-31", weekOrigin: "2024-01-01" });
    expect(output).toMatchObject({ days: -1, weekIndex: -1, offsetDays: 6 });
    expect(
      tool.execute({ date: "2023-12-31", weekOrigin: "2024-01-01" }),
    ).toEqual({ ok: true, output });
  });
});
