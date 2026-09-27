import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("experimental-psychology/experimental-session-fatigue-exposure-term", () => {
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
        trialCount: 60,
        activeSecondsPerTrial: 3,
        restSeconds: 20,
        elapsedSessionSeconds: 200,
      }),
    ).toEqual({
      ok: true,
      output: {
        activeSeconds: 180,
        activeFraction: 0.9,
        unaccountedSeconds: 0,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite trialCount", (value) =>
    expect(tool.execute({ ...example.input, trialCount: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite activeSecondsPerTrial",
    (value) =>
      expect(
        tool.execute({ ...example.input, activeSecondsPerTrial: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite restSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, restSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite elapsedSessionSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, elapsedSessionSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([
    { trialCount: -1 },
    { activeSecondsPerTrial: -1 },
    { restSeconds: -1 },
    { elapsedSessionSeconds: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
