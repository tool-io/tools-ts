import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biometrics/biometric-detection-error-one-operating-point", () => {
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
        falseAccepts: 0,
        impostorAttempts: 100,
        falseRejects: 10,
        genuineAttempts: 100,
        priorImpostor: 0.5,
        falseAcceptCost: 2,
        falseRejectCost: 1,
      }),
    ).toEqual({ ok: true, output: { far: 0, frr: 0.1, weightedCost: 0.05 } });
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
    "rejects nonfinite falseAccepts",
    (value) =>
      expect(tool.execute({ ...example.input, falseAccepts: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite impostorAttempts",
    (value) =>
      expect(
        tool.execute({ ...example.input, impostorAttempts: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite falseRejects",
    (value) =>
      expect(tool.execute({ ...example.input, falseRejects: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite genuineAttempts",
    (value) =>
      expect(
        tool.execute({ ...example.input, genuineAttempts: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite priorImpostor",
    (value) =>
      expect(tool.execute({ ...example.input, priorImpostor: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite falseAcceptCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, falseAcceptCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite falseRejectCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, falseRejectCost: value }).ok,
      ).toBe(false),
  );
  it.each([
    { falseAccepts: -1 },
    { impostorAttempts: 0 },
    { falseRejects: -1 },
    { genuineAttempts: 0 },
    { priorImpostor: -1 },
    { priorImpostor: 2 },
    { falseAcceptCost: -1 },
    { falseRejectCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { falseAccepts: -1 },
    { impostorAttempts: 0 },
    { falseRejects: -1 },
    { genuineAttempts: 0 },
    { priorImpostor: -1 },
    { priorImpostor: 2 },
    { falseAcceptCost: -1 },
    { falseRejectCost: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
