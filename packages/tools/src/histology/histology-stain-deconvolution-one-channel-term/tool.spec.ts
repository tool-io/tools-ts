import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("histology/histology-stain-deconvolution-one-channel-term", () => {
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
        redOd: 0.3,
        greenOd: 0.2,
        blueOd: 0.4,
        coefficientRed: 0,
        coefficientGreen: 1,
        coefficientBlue: 0.5,
      }),
    ).toEqual({ ok: true, output: { concentrationCoordinate: 0.4 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite redOd", (value) =>
    expect(tool.execute({ ...example.input, redOd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite greenOd", (value) =>
    expect(tool.execute({ ...example.input, greenOd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite blueOd", (value) =>
    expect(tool.execute({ ...example.input, blueOd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coefficientRed",
    (value) =>
      expect(tool.execute({ ...example.input, coefficientRed: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coefficientGreen",
    (value) =>
      expect(
        tool.execute({ ...example.input, coefficientGreen: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coefficientBlue",
    (value) =>
      expect(
        tool.execute({ ...example.input, coefficientBlue: value }).ok,
      ).toBe(false),
  );
});
