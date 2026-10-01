import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("nursing/supply-cart-pack-size-remainder", () => {
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
      tool.execute({ availableUnits: 20, unitsPerPack: 6, reservedUnits: 0 }),
    ).toEqual({
      ok: true,
      output: { fullPacks: 3, looseUnits: 2, usableUnits: 20 },
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
    "rejects nonfinite availableUnits",
    (value) =>
      expect(tool.execute({ ...example.input, availableUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite unitsPerPack",
    (value) =>
      expect(tool.execute({ ...example.input, unitsPerPack: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reservedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, reservedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ availableUnits: -1 }, { unitsPerPack: 0 }, { reservedUnits: -1 }])(
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
  it.each([{ availableUnits: -1 }, { unitsPerPack: 0 }, { reservedUnits: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("retains the remainder at the safe integer boundary", () => {
    expect(
      calculate({
        availableUnits: 9007199254740991,
        unitsPerPack: 3,
        reservedUnits: 0,
      }),
    ).toEqual({
      fullPacks: 3002399751580330,
      looseUnits: 1,
      usableUnits: 9007199254740991,
    });
    expect(
      tool.execute({
        availableUnits: 9007199254740991,
        unitsPerPack: 3,
        reservedUnits: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        fullPacks: 3002399751580330,
        looseUnits: 1,
        usableUnits: 9007199254740991,
      },
    });
  });
});
