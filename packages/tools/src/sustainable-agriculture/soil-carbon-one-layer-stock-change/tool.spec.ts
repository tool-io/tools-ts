import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("sustainable-agriculture/soil-carbon-one-layer-stock-change", () => {
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
        area: 50,
        depth: 0.1,
        firstDensity: 1200,
        secondDensity: 1200,
        firstCarbon: 0.02,
        secondCarbon: 0.015,
      }),
    ).toEqual({ ok: true, output: { stockChange: -30 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite area", (value) =>
    expect(tool.execute({ ...example.input, area: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite depth", (value) =>
    expect(tool.execute({ ...example.input, depth: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstDensity",
    (value) =>
      expect(tool.execute({ ...example.input, firstDensity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondDensity",
    (value) =>
      expect(tool.execute({ ...example.input, secondDensity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstCarbon",
    (value) =>
      expect(tool.execute({ ...example.input, firstCarbon: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondCarbon",
    (value) =>
      expect(tool.execute({ ...example.input, secondCarbon: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { area: -1 },
    { depth: -1 },
    { firstDensity: -1 },
    { secondDensity: -1 },
    { firstCarbon: -1 },
    { firstCarbon: 2 },
    { secondCarbon: -1 },
    { secondCarbon: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { area: -1 },
    { depth: -1 },
    { firstDensity: -1 },
    { secondDensity: -1 },
    { firstCarbon: -1 },
    { firstCarbon: 2 },
    { secondCarbon: -1 },
    { secondCarbon: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 68 regression review

it("preserves a signed fixed-depth stock loss in kilograms", () => {
  expect(
    calculate({
      area: 10,
      depth: 0.2,
      firstDensity: 1000,
      secondDensity: 1100,
      firstCarbon: 0.02,
      secondCarbon: 0.01,
    }),
  ).toEqual({ stockChange: -18 });
});
