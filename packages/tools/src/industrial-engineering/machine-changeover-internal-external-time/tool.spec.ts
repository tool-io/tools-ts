import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-engineering/machine-changeover-internal-external-time", () => {
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
        internalBefore: 30,
        externalBefore: 10,
        movedToExternal: 5,
        eliminatedInternal: 5,
        eliminatedExternal: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        internalAfter: 20,
        externalAfter: 15,
        downtimeReduction: 10,
        totalReduction: 5,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite internalBefore",
    (value) =>
      expect(tool.execute({ ...example.input, internalBefore: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite externalBefore",
    (value) =>
      expect(tool.execute({ ...example.input, externalBefore: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite movedToExternal",
    (value) =>
      expect(
        tool.execute({ ...example.input, movedToExternal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite eliminatedInternal",
    (value) =>
      expect(
        tool.execute({ ...example.input, eliminatedInternal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite eliminatedExternal",
    (value) =>
      expect(
        tool.execute({ ...example.input, eliminatedExternal: value }).ok,
      ).toBe(false),
  );
  it.each([
    { internalBefore: -1 },
    { externalBefore: -1 },
    { movedToExternal: -1 },
    { eliminatedInternal: -1 },
    { eliminatedExternal: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { internalBefore: -1 },
    { externalBefore: -1 },
    { movedToExternal: -1 },
    { eliminatedInternal: -1 },
    { eliminatedExternal: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
