import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("adult-education/course-withdrawal-refund-caller-band", () => {
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
        tuition: 1000,
        completedFraction: 0.3,
        lowerFraction: 0,
        upperFraction: 0.25,
        refundFraction: 0.8,
        administrativeFee: 50,
      }),
    ).toEqual({
      ok: true,
      output: { inBand: false, grossRefund: 0, netRefund: 0 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tuition", (value) =>
    expect(tool.execute({ ...example.input, tuition: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite completedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, completedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite lowerFraction",
    (value) =>
      expect(tool.execute({ ...example.input, lowerFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite upperFraction",
    (value) =>
      expect(tool.execute({ ...example.input, upperFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite refundFraction",
    (value) =>
      expect(tool.execute({ ...example.input, refundFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite administrativeFee",
    (value) =>
      expect(
        tool.execute({ ...example.input, administrativeFee: value }).ok,
      ).toBe(false),
  );
  it.each([
    { tuition: -1 },
    { completedFraction: -1 },
    { completedFraction: 2 },
    { lowerFraction: -1 },
    { upperFraction: 2 },
    { refundFraction: -1 },
    { refundFraction: 2 },
    { administrativeFee: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
