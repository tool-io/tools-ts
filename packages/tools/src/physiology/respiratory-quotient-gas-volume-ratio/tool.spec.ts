import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physiology/respiratory-quotient-gas-volume-ratio", () => {
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
        carbonDioxideVolume: 180,
        oxygenVolume: 200,
        co2Correction: 1.1,
        oxygenCorrection: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        correctedCo2: 198.00000000000003,
        correctedOxygen: 200,
        ratio: 0.9900000000000001,
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
    "rejects nonfinite carbonDioxideVolume",
    (value) =>
      expect(
        tool.execute({ ...example.input, carbonDioxideVolume: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite oxygenVolume",
    (value) =>
      expect(tool.execute({ ...example.input, oxygenVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite co2Correction",
    (value) =>
      expect(tool.execute({ ...example.input, co2Correction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite oxygenCorrection",
    (value) =>
      expect(
        tool.execute({ ...example.input, oxygenCorrection: value }).ok,
      ).toBe(false),
  );
  it.each([
    { carbonDioxideVolume: -1 },
    { oxygenVolume: 0 },
    { co2Correction: 0 },
    { oxygenCorrection: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { carbonDioxideVolume: -1 },
    { oxygenVolume: 0 },
    { co2Correction: 0 },
    { oxygenCorrection: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
