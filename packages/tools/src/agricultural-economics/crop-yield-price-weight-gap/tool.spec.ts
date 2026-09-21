import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agricultural-economics/crop-yield-price-weight-gap", () => {
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
      tool.execute({ yields: [], areas: [], prices: [], referenceRevenue: 0 }),
    ).toEqual({ ok: true, output: { totalRevenue: 0, revenueGap: 0 } });
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
    "rejects nonfinite referenceRevenue",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceRevenue: value }).ok,
      ).toBe(false),
  );
});

describe("nested finite yields validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, yields: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "yields" }],
        },
      });
    },
  );
});

describe("nested finite areas validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, areas: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "areas" }],
        },
      });
    },
  );
});

describe("nested finite prices validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, prices: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "prices" }],
        },
      });
    },
  );
});
