import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ecology/ecological-efficiency-trophic-transfer-term", () => {
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
        consumerProduction: 6,
        resourceProduction: 80,
        ingestedEnergy: 40,
        assimilatedEnergy: 20,
      }),
    ).toEqual({
      ok: true,
      output: {
        trophicEfficiency: 0.075,
        assimilationEfficiency: 0.5,
        productionEfficiency: 0.3,
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
    "rejects nonfinite consumerProduction",
    (value) =>
      expect(
        tool.execute({ ...example.input, consumerProduction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite resourceProduction",
    (value) =>
      expect(
        tool.execute({ ...example.input, resourceProduction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ingestedEnergy",
    (value) =>
      expect(tool.execute({ ...example.input, ingestedEnergy: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite assimilatedEnergy",
    (value) =>
      expect(
        tool.execute({ ...example.input, assimilatedEnergy: value }).ok,
      ).toBe(false),
  );
  it.each([
    { consumerProduction: -1 },
    { resourceProduction: 0 },
    { ingestedEnergy: 0 },
    { assimilatedEnergy: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { consumerProduction: -1 },
    { resourceProduction: 0 },
    { ingestedEnergy: 0 },
    { assimilatedEnergy: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
