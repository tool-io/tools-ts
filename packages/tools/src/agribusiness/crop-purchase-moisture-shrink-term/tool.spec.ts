import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agribusiness/crop-purchase-moisture-shrink-term", () => {
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
        wetWeight: 500,
        measuredMoisture: 0.1,
        targetMoisture: 0.1,
        handlingLossFraction: 0,
      }),
    ).toEqual({
      ok: true,
      output: { moistureAdjustedWeight: 500, saleWeight: 500, shrink: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite wetWeight", (value) =>
    expect(tool.execute({ ...example.input, wetWeight: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredMoisture",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredMoisture: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetMoisture",
    (value) =>
      expect(tool.execute({ ...example.input, targetMoisture: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite handlingLossFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, handlingLossFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { wetWeight: -1 },
    { measuredMoisture: -1 },
    { measuredMoisture: 1 },
    { targetMoisture: -1 },
    { targetMoisture: 1 },
    { handlingLossFraction: -1 },
    { handlingLossFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
