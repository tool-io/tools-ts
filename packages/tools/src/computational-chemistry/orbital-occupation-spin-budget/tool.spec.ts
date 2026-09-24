import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-chemistry/orbital-occupation-spin-budget", () => {
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
        alphaOccupations: [1],
        betaOccupations: [1],
        targetElectrons: 2,
        targetSpinDifference: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        electrons: 2,
        spinDifference: 0,
        electronDeficit: 0,
        spinDeficit: 0,
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
    "rejects nonfinite targetElectrons",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetElectrons: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetSpinDifference",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetSpinDifference: value }).ok,
      ).toBe(false),
  );
  it.each([{ alphaOccupations: [2, 1, 0] }, { targetElectrons: -1 }])(
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
  it.each([{ alphaOccupations: [2, 1, 0] }, { targetElectrons: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

// batch 69 reviewed regressions

it("returns electron and spin deficits separately and rejects double alpha occupation", () => {
  expect(
    calculate({
      alphaOccupations: [1, 1],
      betaOccupations: [1, 0],
      targetElectrons: 4,
      targetSpinDifference: 0,
    }),
  ).toEqual({
    electrons: 3,
    spinDifference: 1,
    electronDeficit: 1,
    spinDeficit: -1,
  });
  expect(
    tool.execute({
      alphaOccupations: [2],
      betaOccupations: [0],
      targetElectrons: 2,
      targetSpinDifference: 0,
    }),
  ).toMatchObject({ ok: false, error: { code: "invalid_input" } });
});
