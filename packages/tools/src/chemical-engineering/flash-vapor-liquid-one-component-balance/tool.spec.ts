import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("chemical-engineering/flash-vapor-liquid-one-component-balance", () => {
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
        feedFlow: 80,
        vaporFraction: 0.25,
        feedComposition: 0.4,
        liquidComposition: 0.3,
      }),
    ).toEqual({
      ok: true,
      output: {
        vaporFlow: 20,
        liquidFlow: 60,
        vaporComposition: 0.7000000000000002,
        vaporComponentFlow: 14,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite feedFlow", (value) =>
    expect(tool.execute({ ...example.input, feedFlow: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite vaporFraction",
    (value) =>
      expect(tool.execute({ ...example.input, vaporFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite feedComposition",
    (value) =>
      expect(
        tool.execute({ ...example.input, feedComposition: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite liquidComposition",
    (value) =>
      expect(
        tool.execute({ ...example.input, liquidComposition: value }).ok,
      ).toBe(false),
  );
  it.each([
    { feedFlow: -1 },
    { vaporFraction: 0 },
    { vaporFraction: 2 },
    { feedComposition: -1 },
    { feedComposition: 2 },
    { liquidComposition: -1 },
    { liquidComposition: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
