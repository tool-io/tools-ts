import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("aquatic-science/chlorophyll-extract-volume-sample-factor", () => {
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
        extractConcentration: 5,
        extractVolume: 0.01,
        sampleVolume: 1,
        dilution: 1,
        blankConcentration: 0,
      }),
    ).toEqual({
      ok: true,
      output: { netExtractConcentration: 5, sampleConcentration: 0.05 },
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
    "rejects nonfinite extractConcentration",
    (value) =>
      expect(
        tool.execute({ ...example.input, extractConcentration: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite extractVolume",
    (value) =>
      expect(tool.execute({ ...example.input, extractVolume: value }).ok).toBe(
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dilution", (value) =>
    expect(tool.execute({ ...example.input, dilution: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite blankConcentration",
    (value) =>
      expect(
        tool.execute({ ...example.input, blankConcentration: value }).ok,
      ).toBe(false),
  );
  it.each([
    { extractConcentration: -1 },
    { extractVolume: -1 },
    { sampleVolume: 0 },
    { dilution: 0 },
    { blankConcentration: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
