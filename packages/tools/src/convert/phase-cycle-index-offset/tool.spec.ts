import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("convert/phase-cycle-index-offset", () => {
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
        cycleIndex: -1,
        offset: -2,
        phasesPerCycle: 4,
        phaseIndex: 1,
      }),
    ).toEqual({
      ok: true,
      output: { shiftedCycleDecimal: "-2", shiftedPhase: 3 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cycleIndex", (value) =>
    expect(tool.execute({ ...example.input, cycleIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite offset", (value) =>
    expect(tool.execute({ ...example.input, offset: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite phasesPerCycle",
    (value) =>
      expect(tool.execute({ ...example.input, phasesPerCycle: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite phaseIndex", (value) =>
    expect(tool.execute({ ...example.input, phaseIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ phasesPerCycle: 0 }, { phaseIndex: -1 }])(
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
  it.each([{ phasesPerCycle: 0 }, { phaseIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("uses exact arithmetic across huge cycle carries", () => {
    const output = calculate({
      cycleIndex: 9007199254740991,
      offset: 9007199254740991,
      phasesPerCycle: 4,
      phaseIndex: 3,
    });
    expect(output).toMatchObject({
      shiftedCycleDecimal: "11258999068426239",
      shiftedPhase: 2,
    });
    expect(
      tool.execute({
        cycleIndex: 9007199254740991,
        offset: 9007199254740991,
        phasesPerCycle: 4,
        phaseIndex: 3,
      }),
    ).toEqual({ ok: true, output });
  });
});
