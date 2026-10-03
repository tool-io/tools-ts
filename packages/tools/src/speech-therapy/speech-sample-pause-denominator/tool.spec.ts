import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("speech-therapy/speech-sample-pause-denominator", () => {
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
        totalSeconds: 60,
        pauseSeconds: 20,
        countedUnits: 80,
        excludePauses: false,
      }),
    ).toEqual({
      ok: true,
      output: { denominatorSeconds: 60, unitsPerSecond: 1.3333333333333333 },
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
    "rejects nonfinite totalSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, totalSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pauseSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, pauseSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite countedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, countedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ totalSeconds: 0 }, { countedUnits: -1 }])(
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
  it.each([{ totalSeconds: 0 }, { countedUnits: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("allows all-pause elapsed time when pauses stay in the base", () => {
    expect(
      calculate({
        totalSeconds: 60,
        pauseSeconds: 60,
        countedUnits: 0,
        excludePauses: false,
      }),
    ).toEqual({ denominatorSeconds: 60, unitsPerSecond: 0 });
    expect(
      tool.execute({
        totalSeconds: 60,
        pauseSeconds: 60,
        countedUnits: 0,
        excludePauses: false,
      }),
    ).toEqual({
      ok: true,
      output: { denominatorSeconds: 60, unitsPerSecond: 0 },
    });
  });
});
