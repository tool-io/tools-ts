import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biosafety/safety-inspection-date-precision-token", () => {
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
        inspectionLower: 100,
        inspectionUpper: 100,
        checkDay: 120,
      }),
    ).toEqual({
      ok: true,
      output: { ageLower: 20, ageUpper: 20, exactDate: true },
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
    "rejects nonfinite inspectionLower",
    (value) =>
      expect(
        tool.execute({ ...example.input, inspectionLower: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite inspectionUpper",
    (value) =>
      expect(
        tool.execute({ ...example.input, inspectionUpper: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite checkDay", (value) =>
    expect(tool.execute({ ...example.input, checkDay: value }).ok).toBe(false),
  );
});
