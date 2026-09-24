import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-chemistry/nuclear-charge-electron-balance", () => {
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
        atomicNumbers: [8],
        atomCounts: [1],
        netCharge: -1,
        suppliedElectrons: "8",
      }),
    ).toEqual({
      ok: true,
      output: {
        nuclearChargeDecimal: "8",
        expectedElectronsDecimal: "9",
        residualDecimal: "-1",
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite netCharge", (value) =>
    expect(tool.execute({ ...example.input, netCharge: value }).ok).toBe(false),
  );
  it.each([{ suppliedElectrons: "9.0" }, { netCharge: 11 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ suppliedElectrons: "9.0" }, { netCharge: 11 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as RegressionInputError } from "../../core/simple.js";

describe("batch 72 independent regressions", () => {
  it("retains exact electron balance beyond Number precision", () => {
    const input = {
      atomicNumbers: [6, 1],
      atomCounts: [9007199254740991, 1],
      netCharge: 0,
      suppliedElectrons: "54043195528445947",
    };
    expect(calculate(input)).toEqual({
      nuclearChargeDecimal: "54043195528445947",
      expectedElectronsDecimal: "54043195528445947",
      residualDecimal: "0",
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        nuclearChargeDecimal: "54043195528445947",
        expectedElectronsDecimal: "54043195528445947",
        residualDecimal: "0",
      },
    });
  });
  it("rejects fractional electron witnesses", () => {
    const input = { ...example.input, ...{ suppliedElectrons: "9.5" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "" }],
      },
    });
    expect(() => calculate(input)).toThrowError(RegressionInputError);
  });
});
