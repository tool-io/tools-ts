import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geochemistry/isotope-mixing-two-endmember-fraction", () => {
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
        firstRatio: 1,
        secondRatio: 3,
        firstConcentration: 1,
        secondConcentration: 1,
        firstMassFraction: 0.25,
      }),
    ).toEqual({ ok: true, output: { mixedConcentration: 1, mixedRatio: 2.5 } });
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
    "rejects nonfinite firstConcentration",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstConcentration: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondConcentration",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondConcentration: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstMassFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstMassFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstConcentration: 0, secondConcentration: 0 },
    { firstRatio: -1 },
    { secondRatio: -1 },
    { firstConcentration: -1 },
    { secondConcentration: -1 },
    { firstMassFraction: -1 },
    { firstMassFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
