import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-health/environmental-health-survey-household-base", () => {
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
        surveyHouseholds: 50,
        surveyPeople: 100,
        targetHouseholds: 100,
        targetPeople: 200,
        householdEstimate: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: {
        samplePeoplePerHousehold: 2,
        targetPeoplePerHousehold: 2,
        correctedPersonEstimate: 0.5,
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
    "rejects nonfinite surveyHouseholds",
    (value) =>
      expect(
        tool.execute({ ...example.input, surveyHouseholds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite surveyPeople",
    (value) =>
      expect(tool.execute({ ...example.input, surveyPeople: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetHouseholds",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetHouseholds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetPeople",
    (value) =>
      expect(tool.execute({ ...example.input, targetPeople: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite householdEstimate",
    (value) =>
      expect(
        tool.execute({ ...example.input, householdEstimate: value }).ok,
      ).toBe(false),
  );
  it.each([
    { surveyHouseholds: 0 },
    { surveyPeople: 0 },
    { targetHouseholds: 0 },
    { targetPeople: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { surveyHouseholds: 0 },
    { surveyPeople: 0 },
    { targetHouseholds: 0 },
    { targetPeople: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
