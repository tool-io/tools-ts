import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biophysics/nernst-single-ion-gradient-term", () => {
  it("retains a one-ulp concentration difference at a large common scale", () => {
    expect(
      calculate({
        outside: 2 ** 100 + 2 ** 48,
        inside: 2 ** 100,
        valence: 1,
        gasConstant: 8,
        temperatureK: 300,
        faraday: 96000,
      }).potentialVolts,
    ).toBeCloseTo(5.551115123125782e-18, 32);
  });
  it("handles finite concentration inputs whose ratio would overflow", () => {
    const result = calculate({
      outside: 1e308,
      inside: 1e-308,
      valence: 1,
      gasConstant: 8,
      temperatureK: 300,
      faraday: 96000,
    });
    expect(result.potentialVolts).toBeCloseTo(35.4598104321083, 12);
  });
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
        outside: 1,
        inside: 10,
        valence: -1,
        gasConstant: 8,
        temperatureK: 300,
        faraday: 96000,
      }),
    ).toEqual({ ok: true, output: { potentialVolts: 0.057564627324851146 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite outside", (value) =>
    expect(tool.execute({ ...example.input, outside: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite inside", (value) =>
    expect(tool.execute({ ...example.input, inside: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite valence", (value) =>
    expect(tool.execute({ ...example.input, valence: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasConstant",
    (value) =>
      expect(tool.execute({ ...example.input, gasConstant: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite temperatureK",
    (value) =>
      expect(tool.execute({ ...example.input, temperatureK: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite faraday", (value) =>
    expect(tool.execute({ ...example.input, faraday: value }).ok).toBe(false),
  );
  it.each([
    { outside: 0 },
    { inside: 0 },
    { gasConstant: 0 },
    { temperatureK: 0 },
    { faraday: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
