import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("developmental-psychology/child-executive-task-rule-switch-gap", () => {
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
        repeatMeanMs: 400,
        switchMeanMs: 380,
        repeatErrors: 1,
        repeatTrials: 10,
        switchErrors: 1,
        switchTrials: 10,
      }),
    ).toEqual({
      ok: true,
      output: { latencySwitchCostMs: -20, errorSwitchCost: 0 },
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
    "rejects nonfinite repeatMeanMs",
    (value) =>
      expect(tool.execute({ ...example.input, repeatMeanMs: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite switchMeanMs",
    (value) =>
      expect(tool.execute({ ...example.input, switchMeanMs: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite repeatErrors",
    (value) =>
      expect(tool.execute({ ...example.input, repeatErrors: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite repeatTrials",
    (value) =>
      expect(tool.execute({ ...example.input, repeatTrials: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite switchErrors",
    (value) =>
      expect(tool.execute({ ...example.input, switchErrors: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite switchTrials",
    (value) =>
      expect(tool.execute({ ...example.input, switchTrials: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { repeatMeanMs: -1 },
    { switchMeanMs: -1 },
    { repeatErrors: -1 },
    { repeatTrials: 0 },
    { switchErrors: -1 },
    { switchTrials: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
