import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("financial-economics/currency-hedged-return-one-forward-term", () => {
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
        foreignAssetReturn: 0,
        spotStart: 1,
        spotEnd: 1.2,
        forwardRate: 1,
        hedgeFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: {
        unhedgedDomesticReturn: 0.19999999999999996,
        hedgeContribution: -0.09999999999999998,
        hedgedReturn: 0.09999999999999998,
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
    "rejects nonfinite foreignAssetReturn",
    (value) =>
      expect(
        tool.execute({ ...example.input, foreignAssetReturn: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite spotStart", (value) =>
    expect(tool.execute({ ...example.input, spotStart: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite spotEnd", (value) =>
    expect(tool.execute({ ...example.input, spotEnd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite forwardRate",
    (value) =>
      expect(tool.execute({ ...example.input, forwardRate: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite hedgeFraction",
    (value) =>
      expect(tool.execute({ ...example.input, hedgeFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { foreignAssetReturn: -2 },
    { spotStart: 0 },
    { spotEnd: 0 },
    { forwardRate: 0 },
    { hedgeFraction: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
