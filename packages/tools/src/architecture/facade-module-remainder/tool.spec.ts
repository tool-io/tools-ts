import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("architecture/facade-module-remainder", () => {
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
        availableWidth: 8,
        moduleCount: 3,
        moduleWidth: 2,
        internalJointWidth: 0.5,
        leftEdgeJoint: 0,
        rightEdgeJoint: 0,
      }),
    ).toEqual({ ok: true, output: { remainder: 1 } });
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
    "rejects nonfinite availableWidth",
    (value) =>
      expect(tool.execute({ ...example.input, availableWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite moduleCount",
    (value) =>
      expect(tool.execute({ ...example.input, moduleCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite moduleWidth",
    (value) =>
      expect(tool.execute({ ...example.input, moduleWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite internalJointWidth",
    (value) =>
      expect(
        tool.execute({ ...example.input, internalJointWidth: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite leftEdgeJoint",
    (value) =>
      expect(tool.execute({ ...example.input, leftEdgeJoint: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rightEdgeJoint",
    (value) =>
      expect(tool.execute({ ...example.input, rightEdgeJoint: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { availableWidth: -1 },
    { moduleCount: -1 },
    { moduleWidth: -1 },
    { internalJointWidth: -1 },
    { leftEdgeJoint: -1 },
    { rightEdgeJoint: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { availableWidth: -1 },
    { moduleCount: -1 },
    { moduleWidth: -1 },
    { internalJointWidth: -1 },
    { leftEdgeJoint: -1 },
    { rightEdgeJoint: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
