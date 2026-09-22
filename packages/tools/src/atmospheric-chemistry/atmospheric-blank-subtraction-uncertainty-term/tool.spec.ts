import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-chemistry/atmospheric-blank-subtraction-uncertainty-term", () => {
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
        sampleAmount: 20,
        blankAmount: 1,
        sampleVolume: 4,
        blankEquivalentVolume: 2,
        sampleUncertainty: 4,
        blankUncertainty: 2,
      }),
    ).toEqual({
      ok: true,
      output: {
        correctedConcentration: 4.5,
        combinedUncertainty: 1.4142135623730951,
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
    "rejects nonfinite sampleAmount",
    (value) =>
      expect(tool.execute({ ...example.input, sampleAmount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite blankAmount",
    (value) =>
      expect(tool.execute({ ...example.input, blankAmount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampleVolume",
    (value) =>
      expect(tool.execute({ ...example.input, sampleVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite blankEquivalentVolume",
    (value) =>
      expect(
        tool.execute({ ...example.input, blankEquivalentVolume: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampleUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, sampleUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite blankUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, blankUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([
    { sampleVolume: 0 },
    { blankEquivalentVolume: 0 },
    { sampleUncertainty: -1 },
    { blankUncertainty: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
