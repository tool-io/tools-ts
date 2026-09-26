import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("electrochemistry/nernst-reaction-quotient-log-term", () => {
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
        temperatureK: 320,
        electronCount: 1,
        reactionQuotient: 1,
        gasConstant: 8,
        faradayConstant: 96000,
      }),
    ).toEqual({ ok: true, output: { potentialCorrection: 0 } });
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
    "rejects nonfinite temperatureK",
    (value) =>
      expect(tool.execute({ ...example.input, temperatureK: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite electronCount",
    (value) =>
      expect(tool.execute({ ...example.input, electronCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reactionQuotient",
    (value) =>
      expect(
        tool.execute({ ...example.input, reactionQuotient: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasConstant",
    (value) =>
      expect(tool.execute({ ...example.input, gasConstant: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite faradayConstant",
    (value) =>
      expect(
        tool.execute({ ...example.input, faradayConstant: value }).ok,
      ).toBe(false),
  );
  it.each([
    { temperatureK: 0 },
    { electronCount: 0 },
    { reactionQuotient: 0 },
    { gasConstant: 0 },
    { faradayConstant: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });

  it.each([
    { temperatureK: 0 },
    { electronCount: 0 },
    { reactionQuotient: 0 },
    { gasConstant: 0 },
    { faradayConstant: 0 },
  ])("reviewed-domain direct validation %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrow();
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect([
        "invalid_field",
        "invalid_domain",
        "result_out_of_range",
      ]).toContain(result.error.issues[0].code);
  });
});
