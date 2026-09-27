import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/adaptation-fixation-supplied-effect-term", () => {
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
        p: 0.5,
        effectiveDiploids: 1,
        selectionCoefficient: 0.2746530721670274,
      }),
    ).toEqual({
      ok: true,
      output: { fixationProbability: 0.6339745962155614 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite p", (value) =>
    expect(tool.execute({ ...example.input, p: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effectiveDiploids",
    (value) =>
      expect(
        tool.execute({ ...example.input, effectiveDiploids: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite selectionCoefficient",
    (value) =>
      expect(
        tool.execute({ ...example.input, selectionCoefficient: value }).ok,
      ).toBe(false),
  );
  it.each([{ p: -1 }, { p: 2 }, { effectiveDiploids: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("preserves neutral and absorbing boundaries under strong negative selection", () => {
    expect(
      calculate({ p: 0.2, effectiveDiploids: 100, selectionCoefficient: 0 }),
    ).toEqual({ fixationProbability: 0.2 });
    expect(
      calculate({ p: 0, effectiveDiploids: 1000, selectionCoefficient: -1 }),
    ).toEqual({ fixationProbability: 0 });
    expect(
      calculate({ p: 1, effectiveDiploids: 1000, selectionCoefficient: -1 }),
    ).toEqual({ fixationProbability: 1 });
    const out = calculate({
      p: 0.5,
      effectiveDiploids: 1000,
      selectionCoefficient: -1,
    });
    expect(out.fixationProbability).toBeGreaterThanOrEqual(0);
    expect(out.fixationProbability).toBeLessThan(1e-300);
  });
  it.each([{ p: -1 }, { p: 2 }, { effectiveDiploids: 0 }])(
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
