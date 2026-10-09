import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health/sleep-log-nap-overlap-duration", () => {
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
        sleepStartMinutes: 100,
        sleepEndMinutes: 200,
        napStartMinutes: 200,
        napEndMinutes: 240,
      }),
    ).toEqual({ ok: true, output: { overlapMinutes: 0 } });
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
    "rejects nonfinite sleepStartMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, sleepStartMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sleepEndMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, sleepEndMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite napStartMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, napStartMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite napEndMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, napEndMinutes: value }).ok).toBe(
        false,
      ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        sleepStartMinutes: 10,
        sleepEndMinutes: 20,
        napStartMinutes: 20,
        napEndMinutes: 30,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { overlapMinutes: 0 },
    });
    expect(calculate(input)).toEqual({ overlapMinutes: 0 });
  });
});
