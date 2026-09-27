import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ethnomusicology/performance-call-response-lag-term", () => {
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
      tool.execute({ callEnd: 20, responseStart: 19, cycleDuration: 4 }),
    ).toEqual({
      ok: true,
      output: { lag: -1, cyclePhase: 0.75, overlap: true },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite callEnd", (value) =>
    expect(tool.execute({ ...example.input, callEnd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite responseStart",
    (value) =>
      expect(tool.execute({ ...example.input, responseStart: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cycleDuration",
    (value) =>
      expect(tool.execute({ ...example.input, cycleDuration: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ cycleDuration: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("retains a tiny positive response phase", () => {
    expect(
      calculate({ callEnd: 0, responseStart: 1e-20, cycleDuration: 1 })
        .cyclePhase,
    ).toBe(1e-20);
  });
  it.each([{ cycleDuration: 0 }])(
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
