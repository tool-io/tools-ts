import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("speech-therapy/communication-aid-switch-cycle-time", () => {
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
        rowChoices: 3,
        columnChoices: 3,
        rowIndex: 0,
        columnIndex: 2,
        dwellSeconds: 1,
        confirmationSeconds: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { rowDelay: 0, columnDelay: 2, totalSeconds: 2.5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rowChoices", (value) =>
    expect(tool.execute({ ...example.input, rowChoices: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite columnChoices",
    (value) =>
      expect(tool.execute({ ...example.input, columnChoices: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rowIndex", (value) =>
    expect(tool.execute({ ...example.input, rowIndex: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite columnIndex",
    (value) =>
      expect(tool.execute({ ...example.input, columnIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dwellSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, dwellSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite confirmationSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, confirmationSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([
    { rowChoices: 0 },
    { columnChoices: 0 },
    { rowIndex: -1 },
    { columnIndex: -1 },
    { dwellSeconds: -1 },
    { confirmationSeconds: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rowChoices: 0 },
    { columnChoices: 0 },
    { rowIndex: -1 },
    { columnIndex: -1 },
    { dwellSeconds: -1 },
    { confirmationSeconds: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
