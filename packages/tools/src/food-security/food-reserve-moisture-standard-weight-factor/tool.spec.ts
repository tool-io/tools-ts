import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-security/food-reserve-moisture-standard-weight-factor", () => {
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
        wetMass: 200,
        moisture: 0.1,
        targetMoisture: 0.1,
        handlingLoss: 0,
      }),
    ).toEqual({
      ok: true,
      output: { dryMass: 180, standardMass: 200, netStandardMass: 200 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite wetMass", (value) =>
    expect(tool.execute({ ...example.input, wetMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite moisture", (value) =>
    expect(tool.execute({ ...example.input, moisture: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetMoisture",
    (value) =>
      expect(tool.execute({ ...example.input, targetMoisture: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite handlingLoss",
    (value) =>
      expect(tool.execute({ ...example.input, handlingLoss: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { wetMass: -1 },
    { moisture: -1 },
    { moisture: 1 },
    { targetMoisture: -1 },
    { targetMoisture: 1 },
    { handlingLoss: -1 },
    { handlingLoss: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { wetMass: -1 },
    { moisture: -1 },
    { moisture: 1 },
    { targetMoisture: -1 },
    { targetMoisture: 1 },
    { handlingLoss: -1 },
    { handlingLoss: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
