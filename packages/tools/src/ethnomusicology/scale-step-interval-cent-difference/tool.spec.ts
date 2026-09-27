import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ethnomusicology/scale-step-interval-cent-difference", () => {
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
        secondRatio: 0.5,
        periodRatio: 2,
        wrap: true,
      }),
    ).toEqual({ ok: true, output: { rawCents: -1200, intervalCents: 0 } });
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
    "rejects nonfinite periodRatio",
    (value) =>
      expect(tool.execute({ ...example.input, periodRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ firstRatio: 0 }, { secondRatio: 0 }, { periodRatio: 1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("does not perturb an already in-period tiny positive interval", () => {
    const input = {
      firstRatio: 1,
      secondRatio: 1 + Number.EPSILON,
      periodRatio: 2,
      wrap: false,
    };
    const raw = calculate(input);
    expect(raw.rawCents).toBeGreaterThan(0);
    expect(calculate({ ...input, wrap: true }).intervalCents).toBe(
      raw.rawCents,
    );
  });
  it.each([{ firstRatio: 0 }, { secondRatio: 0 }, { periodRatio: 1 }])(
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
