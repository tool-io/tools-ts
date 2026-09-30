import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("metrics/concordance-one-tied-pair-credit", () => {
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
        firstPrediction: 2,
        secondPrediction: 4,
        firstOutcome: 1,
        secondOutcome: 3,
        tieCredit: 0.5,
      }),
    ).toEqual({ ok: true, output: { comparable: true, credit: 1 } });
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
    "rejects nonfinite firstPrediction",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstPrediction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondPrediction",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondPrediction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstOutcome",
    (value) =>
      expect(tool.execute({ ...example.input, firstOutcome: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondOutcome",
    (value) =>
      expect(tool.execute({ ...example.input, secondOutcome: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tieCredit", (value) =>
    expect(tool.execute({ ...example.input, tieCredit: value }).ok).toBe(false),
  );
  it.each([{ tieCredit: -1 }, { tieCredit: 2 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
