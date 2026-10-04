import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("vertical-farming/vertical-farm-water-recovery-condensate-share", () => {
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
        condensate: 10,
        drainReturn: 20,
        withdrawn: 80,
        evaporation: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        recovered: 30,
        recoveredShare: 0.375,
        netWithdrawal: 50,
        evaporativeLossShare: 0,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite condensate", (value) =>
    expect(tool.execute({ ...example.input, condensate: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite drainReturn",
    (value) =>
      expect(tool.execute({ ...example.input, drainReturn: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite withdrawn", (value) =>
    expect(tool.execute({ ...example.input, withdrawn: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite evaporation",
    (value) =>
      expect(tool.execute({ ...example.input, evaporation: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { condensate: -1 },
    { drainReturn: -1 },
    { withdrawn: 0 },
    { evaporation: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { condensate: -1 },
    { drainReturn: -1 },
    { withdrawn: 0 },
    { evaporation: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

it("counts evaporation separately from net external withdrawal", () => {
  expect(
    calculate({
      condensate: 10,
      drainReturn: 20,
      withdrawn: 100,
      evaporation: 5,
    }),
  ).toEqual({
    recovered: 30,
    recoveredShare: 0.3,
    netWithdrawal: 70,
    evaporativeLossShare: 0.05,
  });
});
