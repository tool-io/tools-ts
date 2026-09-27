import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geochemistry/isotope-ratio-mixing-weight", () => {
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
        firstRatio: 2,
        secondRatio: 4,
        firstDenominatorIsotopeAmount: 0,
        secondDenominatorIsotopeAmount: 3,
      }),
    ).toEqual({ ok: true, output: { mixedRatio: 4, firstWeight: 0 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstRatio", (value) =>
    expect(tool.execute({ ...example.input, firstRatio: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondRatio",
    (value) =>
      expect(tool.execute({ ...example.input, secondRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstDenominatorIsotopeAmount",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstDenominatorIsotopeAmount: value })
          .ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondDenominatorIsotopeAmount",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          secondDenominatorIsotopeAmount: value,
        }).ok,
      ).toBe(false),
  );
  it.each([
    { firstDenominatorIsotopeAmount: 0, secondDenominatorIsotopeAmount: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstDenominatorIsotopeAmount: 0, secondDenominatorIsotopeAmount: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("normalizes huge denominator amounts before adding", () => {
    const output = calculate({
      firstRatio: 2,
      secondRatio: 4,
      firstDenominatorIsotopeAmount: 1e308,
      secondDenominatorIsotopeAmount: 1e308,
    });
    expect(output).toMatchObject({ mixedRatio: 3, firstWeight: 0.5 });
    expect(
      tool.execute({
        firstRatio: 2,
        secondRatio: 4,
        firstDenominatorIsotopeAmount: 1e308,
        secondDenominatorIsotopeAmount: 1e308,
      }),
    ).toEqual({ ok: true, output });
  });
  it("preserves weights when both supplied ratios are zero", () => {
    const output = calculate({
      firstRatio: 0,
      secondRatio: 0,
      firstDenominatorIsotopeAmount: 1e308,
      secondDenominatorIsotopeAmount: 1e308,
    });
    expect(output).toMatchObject({ mixedRatio: 0, firstWeight: 0.5 });
    expect(
      tool.execute({
        firstRatio: 0,
        secondRatio: 0,
        firstDenominatorIsotopeAmount: 1e308,
        secondDenominatorIsotopeAmount: 1e308,
      }),
    ).toEqual({ ok: true, output });
  });
  it("does not overflow identical maximal finite ratios", () => {
    const output = calculate({
      firstRatio: 1.7976931348623157e308,
      secondRatio: 1.7976931348623157e308,
      firstDenominatorIsotopeAmount: 1,
      secondDenominatorIsotopeAmount: 1,
    });
    expect(output).toMatchObject({
      mixedRatio: 1.7976931348623157e308,
      firstWeight: 0.5,
    });
    expect(
      tool.execute({
        firstRatio: 1.7976931348623157e308,
        secondRatio: 1.7976931348623157e308,
        firstDenominatorIsotopeAmount: 1,
        secondDenominatorIsotopeAmount: 1,
      }),
    ).toEqual({ ok: true, output });
  });
});
