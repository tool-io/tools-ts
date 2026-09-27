import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("forensic-science/chain-of-custody-timezone-order-check", () => {
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
        releaseLocalSeconds: 10000,
        receiveLocalSeconds: 11000,
        releaseUtcOffsetSeconds: 0,
        receiveUtcOffsetSeconds: 3600,
      }),
    ).toEqual({
      ok: true,
      output: {
        releaseUtcSeconds: 10000,
        receiveUtcSeconds: 7400,
        transitSeconds: -2600,
        ordered: false,
      },
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
    "rejects nonfinite releaseLocalSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, releaseLocalSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receiveLocalSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, receiveLocalSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite releaseUtcOffsetSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, releaseUtcOffsetSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receiveUtcOffsetSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, receiveUtcOffsetSeconds: value }).ok,
      ).toBe(false),
  );
});
