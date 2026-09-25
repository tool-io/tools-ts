import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("data-science/model-residual-one-observation-leverage", () => {
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
    expect(tool.execute({ residual: 2, leverage: 0, residualSd: 4 })).toEqual({
      ok: true,
      output: { pressResidual: 2, internallyStudentized: 0.5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite residual", (value) =>
    expect(tool.execute({ ...example.input, residual: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite leverage", (value) =>
    expect(tool.execute({ ...example.input, leverage: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite residualSd", (value) =>
    expect(tool.execute({ ...example.input, residualSd: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ leverage: -1 }, { leverage: 1 }, { residualSd: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("studentizes subnormal matched residual and standard deviation without a zero intermediate", () => {
    expect(
      calculate({ residual: 3e-310, residualSd: 4e-310, leverage: 0.75 })
        .internallyStudentized,
    ).toBeCloseTo(1.5, 12);
  });
  it.each([{ leverage: -1 }, { leverage: 1 }, { residualSd: 0 }])(
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
