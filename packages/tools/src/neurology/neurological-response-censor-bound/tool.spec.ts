import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("neurology/neurological-response-censor-bound", () => {
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
        elapsed: 0,
        responseObserved: false,
        suppliedCensorTime: 20,
      }),
    ).toEqual({ ok: true, output: { time: 20, rightCensored: true } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite elapsed", (value) =>
    expect(tool.execute({ ...example.input, elapsed: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedCensorTime",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedCensorTime: value }).ok,
      ).toBe(false),
  );
});

describe("batch 70 independent regressions", () => {
  it("records a censor bound without an observed response", () => {
    expect(
      calculate({
        elapsed: 0,
        responseObserved: false,
        suppliedCensorTime: 25,
      }),
    ).toEqual({ time: 25, rightCensored: true });
    expect(
      tool.execute({
        elapsed: 0,
        responseObserved: false,
        suppliedCensorTime: 25,
      }),
    ).toEqual({ ok: true, output: { time: 25, rightCensored: true } });
  });
});
