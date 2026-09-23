import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biostatistics/censored-event-riskset-flag", () => {
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
        entry: 0,
        exit: 10,
        eventAtExit: false,
        evaluationTime: 10,
        evaluateBeforeEvents: false,
      }),
    ).toEqual({
      ok: true,
      output: { inRiskSet: false, eventAtEvaluation: false },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite entry", (value) =>
    expect(tool.execute({ ...example.input, entry: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite exit", (value) =>
    expect(tool.execute({ ...example.input, exit: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite evaluationTime",
    (value) =>
      expect(tool.execute({ ...example.input, evaluationTime: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ exit: -1 }])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ exit: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 independent regressions", () => {
  it("retains a censored record immediately before its exit", () => {
    const input = {
      entry: 2,
      exit: 10,
      eventAtExit: false,
      evaluationTime: 10,
      evaluateBeforeEvents: true,
    };
    expect(calculate(input)).toEqual({
      inRiskSet: true,
      eventAtEvaluation: false,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { inRiskSet: true, eventAtEvaluation: false },
    });
  });
  it("removes a record after its exit without inventing an event", () => {
    const input = {
      entry: 2,
      exit: 10,
      eventAtExit: false,
      evaluationTime: 10,
      evaluateBeforeEvents: false,
    };
    expect(calculate(input)).toEqual({
      inRiskSet: false,
      eventAtEvaluation: false,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { inRiskSet: false, eventAtEvaluation: false },
    });
  });
});
