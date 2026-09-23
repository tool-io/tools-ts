import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biosafety/biosafety-reusable-equipment-checkout-lag", () => {
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
        checkoutDay: 100,
        dueDay: 115,
        returnDay: 0,
        returned: false,
        observationDay: 108,
      }),
    ).toEqual({
      ok: true,
      output: { elapsed: 8, lateDays: 0, returned: false },
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
    "rejects nonfinite checkoutDay",
    (value) =>
      expect(tool.execute({ ...example.input, checkoutDay: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dueDay", (value) =>
    expect(tool.execute({ ...example.input, dueDay: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite returnDay", (value) =>
    expect(tool.execute({ ...example.input, returnDay: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observationDay",
    (value) =>
      expect(tool.execute({ ...example.input, observationDay: value }).ok).toBe(
        false,
      ),
  );
});
