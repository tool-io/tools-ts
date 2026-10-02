import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pathology/necrotic-area-research-grid-share", () => {
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
        designatedHits: 15,
        viableHits: 45,
        excludedHits: 0,
        pointsPerArea: 30,
      }),
    ).toEqual({
      ok: true,
      output: {
        eligiblePoints: 60,
        designatedFraction: 0.25,
        sampledArea: 2,
        excludedFraction: 0,
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
    "rejects nonfinite designatedHits",
    (value) =>
      expect(tool.execute({ ...example.input, designatedHits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite viableHits", (value) =>
    expect(tool.execute({ ...example.input, viableHits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedHits",
    (value) =>
      expect(tool.execute({ ...example.input, excludedHits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pointsPerArea",
    (value) =>
      expect(tool.execute({ ...example.input, pointsPerArea: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { designatedHits: 0, viableHits: 0 },
    { designatedHits: -1 },
    { viableHits: -1 },
    { excludedHits: -1 },
    { pointsPerArea: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { designatedHits: 0, viableHits: 0 },
    { designatedHits: -1 },
    { viableHits: -1 },
    { excludedHits: -1 },
    { pointsPerArea: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
