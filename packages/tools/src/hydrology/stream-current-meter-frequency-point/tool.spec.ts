import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hydrology/stream-current-meter-frequency-point", () => {
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
        revolutions: 20,
        durationSeconds: 5,
        slope: 0.1,
        intercept: 0.02,
      }),
    ).toEqual({
      ok: true,
      output: { frequencyHz: 4, velocity: 0.42000000000000004 },
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
    "rejects nonfinite revolutions",
    (value) =>
      expect(tool.execute({ ...example.input, revolutions: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite durationSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, durationSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite slope", (value) =>
    expect(tool.execute({ ...example.input, slope: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite intercept", (value) =>
    expect(tool.execute({ ...example.input, intercept: value }).ok).toBe(false),
  );
  it.each([{ revolutions: -1 }, { durationSeconds: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );

  it.each([{ revolutions: -1 }, { durationSeconds: 0 }])(
    "reviewed-domain direct validation %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrow();
      const result = tool.execute({ ...example.input, ...change });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect([
          "invalid_field",
          "invalid_domain",
          "result_out_of_range",
        ]).toContain(result.error.issues[0].code);
    },
  );
});
