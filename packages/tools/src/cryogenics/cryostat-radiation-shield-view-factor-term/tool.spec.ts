import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cryogenics/cryostat-radiation-shield-view-factor-term", () => {
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
        hotTemperatureK: 200,
        coldTemperatureK: 100,
        area: 2,
        effectiveEmissivity: 0.2,
        viewFactor: 0.5,
        stefanBoltzmann: 5.670374419e-8,
      }),
    ).toEqual({ ok: true, output: { heatLoad: 17.011123257 } });
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
    "rejects nonfinite hotTemperatureK",
    (value) =>
      expect(
        tool.execute({ ...example.input, hotTemperatureK: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coldTemperatureK",
    (value) =>
      expect(
        tool.execute({ ...example.input, coldTemperatureK: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite area", (value) =>
    expect(tool.execute({ ...example.input, area: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effectiveEmissivity",
    (value) =>
      expect(
        tool.execute({ ...example.input, effectiveEmissivity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite viewFactor", (value) =>
    expect(tool.execute({ ...example.input, viewFactor: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stefanBoltzmann",
    (value) =>
      expect(
        tool.execute({ ...example.input, stefanBoltzmann: value }).ok,
      ).toBe(false),
  );
  it.each([
    { coldTemperatureK: -1 },
    { area: -1 },
    { effectiveEmissivity: -1 },
    { effectiveEmissivity: 2 },
    { viewFactor: -1 },
    { viewFactor: 2 },
    { stefanBoltzmann: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
