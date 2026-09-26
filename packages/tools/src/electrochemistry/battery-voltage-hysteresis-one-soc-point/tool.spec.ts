import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("electrochemistry/battery-voltage-hysteresis-one-soc-point", () => {
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
        chargeVoltage: 3.6,
        dischargeVoltage: 3.4,
        chargeSoc: 0.4,
        dischargeSoc: 0.5,
        tolerance: 0.05,
      }),
    ).toEqual({
      ok: true,
      output: {
        hysteresis: 0.20000000000000018,
        midpoint: 3.5,
        comparable: false,
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
    "rejects nonfinite chargeVoltage",
    (value) =>
      expect(tool.execute({ ...example.input, chargeVoltage: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dischargeVoltage",
    (value) =>
      expect(
        tool.execute({ ...example.input, dischargeVoltage: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite chargeSoc", (value) =>
    expect(tool.execute({ ...example.input, chargeSoc: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dischargeSoc",
    (value) =>
      expect(tool.execute({ ...example.input, dischargeSoc: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tolerance", (value) =>
    expect(tool.execute({ ...example.input, tolerance: value }).ok).toBe(false),
  );
  it.each([
    { chargeSoc: -1 },
    { chargeSoc: 2 },
    { dischargeSoc: -1 },
    { dischargeSoc: 2 },
    { tolerance: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
