import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-engineering/aeration-oxygen-transfer-supplied-factor", () => {
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
        standardTransferRate: 50,
        alpha: 0.6,
        beta: 1,
        cleanSaturation: 8,
        processDissolved: 0,
        temperatureFactor: 1.2,
      }),
    ).toEqual({
      ok: true,
      output: { drivingForceFraction: 1, actualTransferRate: 36 },
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
    "rejects nonfinite standardTransferRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, standardTransferRate: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite alpha", (value) =>
    expect(tool.execute({ ...example.input, alpha: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite beta", (value) =>
    expect(tool.execute({ ...example.input, beta: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cleanSaturation",
    (value) =>
      expect(
        tool.execute({ ...example.input, cleanSaturation: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite processDissolved",
    (value) =>
      expect(
        tool.execute({ ...example.input, processDissolved: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite temperatureFactor",
    (value) =>
      expect(
        tool.execute({ ...example.input, temperatureFactor: value }).ok,
      ).toBe(false),
  );
  it.each([
    { standardTransferRate: -1 },
    { alpha: -1 },
    { beta: -1 },
    { cleanSaturation: 0 },
    { processDissolved: -1 },
    { temperatureFactor: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
