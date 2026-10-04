import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("vertical-farming/tray-count-level-boundary-token", () => {
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
        firstLevel: 2,
        lastLevel: 2,
        traysPerLevel: 10,
        includeFirst: true,
        includeLast: true,
      }),
    ).toEqual({ ok: true, output: { countedLevels: 1, trays: 10 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstLevel", (value) =>
    expect(tool.execute({ ...example.input, firstLevel: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lastLevel", (value) =>
    expect(tool.execute({ ...example.input, lastLevel: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite traysPerLevel",
    (value) =>
      expect(tool.execute({ ...example.input, traysPerLevel: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ firstLevel: -1 }, { traysPerLevel: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ firstLevel: -1 }, { traysPerLevel: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("does not double count an excluded single level", () => {
    expect(
      calculate({
        firstLevel: 2,
        lastLevel: 2,
        traysPerLevel: 10,
        includeFirst: false,
        includeLast: false,
      }),
    ).toEqual({ countedLevels: 0, trays: 0 });
    expect(
      tool.execute({
        firstLevel: 2,
        lastLevel: 2,
        traysPerLevel: 10,
        includeFirst: false,
        includeLast: false,
      }),
    ).toEqual({ ok: true, output: { countedLevels: 0, trays: 0 } });
  });
});
