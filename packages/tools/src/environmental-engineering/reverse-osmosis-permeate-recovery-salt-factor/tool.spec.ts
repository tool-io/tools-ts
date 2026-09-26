import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-engineering/reverse-osmosis-permeate-recovery-salt-factor", () => {
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
        recovery: 0.25,
        feedConcentration: 200,
        rejection: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        permeateFlow: 20,
        concentrateFlow: 60,
        permeateConcentration: 0,
        concentrateConcentration: 266.6666666666667,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite recovery", (value) =>
    expect(tool.execute({ ...example.input, recovery: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite feedConcentration",
    (value) =>
      expect(
        tool.execute({ ...example.input, feedConcentration: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rejection", (value) =>
    expect(tool.execute({ ...example.input, rejection: value }).ok).toBe(false),
  );
  it.each([
    { recovery: 1 },
    { feedFlow: -1 },
    { recovery: -1 },
    { recovery: 1 },
    { feedConcentration: -1 },
    { rejection: -1 },
    { rejection: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
