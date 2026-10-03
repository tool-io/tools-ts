import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("supply-chain/pallet-layer-height-remainder", () => {
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
        maximumHeight: 100,
        palletHeight: 10,
        layerHeight: 20,
        separatorHeight: 0,
      }),
    ).toEqual({
      ok: true,
      output: { layers: 4, usedHeight: 90, residual: 10 },
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
    "rejects nonfinite maximumHeight",
    (value) =>
      expect(tool.execute({ ...example.input, maximumHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite palletHeight",
    (value) =>
      expect(tool.execute({ ...example.input, palletHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite layerHeight",
    (value) =>
      expect(tool.execute({ ...example.input, layerHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite separatorHeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, separatorHeight: value }).ok,
      ).toBe(false),
  );
  it.each([
    { maximumHeight: 20, palletHeight: 10, layerHeight: 30 },
    { palletHeight: -1 },
    { layerHeight: 0 },
    { separatorHeight: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { maximumHeight: 20, palletHeight: 10, layerHeight: 30 },
    { palletHeight: -1 },
    { layerHeight: 0 },
    { separatorHeight: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("uses no separator outside the layer stack and rejects a first-layer misfit", () => {
  expect(
    calculate({
      maximumHeight: 40,
      palletHeight: 10,
      layerHeight: 30,
      separatorHeight: 5,
    }),
  ).toEqual({ layers: 1, usedHeight: 40, residual: 0 });
  expect(
    tool.execute({
      maximumHeight: 20,
      palletHeight: 10,
      layerHeight: 30,
      separatorHeight: 2,
    }),
  ).toMatchObject({ ok: false, error: { code: "invalid_input" } });
});
