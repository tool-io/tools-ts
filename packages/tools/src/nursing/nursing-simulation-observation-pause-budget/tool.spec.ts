import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("nursing/nursing-simulation-observation-pause-budget", () => {
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
        stationMinutes: 45,
        briefingMinutes: 5,
        pauseMinutes: 5,
        debriefMinutes: 5,
        observationOverlap: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        activeObservation: 30,
        excludedUnion: 15,
        observationShare: 0.6666666666666666,
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
    "rejects nonfinite stationMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, stationMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite briefingMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, briefingMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pauseMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, pauseMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite debriefMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, debriefMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observationOverlap",
    (value) =>
      expect(
        tool.execute({ ...example.input, observationOverlap: value }).ok,
      ).toBe(false),
  );
  it.each([
    { stationMinutes: 0 },
    { briefingMinutes: -1 },
    { pauseMinutes: -1 },
    { debriefMinutes: -1 },
    { observationOverlap: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { stationMinutes: 0 },
    { briefingMinutes: -1 },
    { pauseMinutes: -1 },
    { debriefMinutes: -1 },
    { observationOverlap: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
