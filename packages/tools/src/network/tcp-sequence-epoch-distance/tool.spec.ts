import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("network/tcp-sequence-epoch-distance", () => {
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
        firstEpoch: "3",
        firstSequence: 4,
        secondEpoch: "2",
        secondSequence: 4294967290,
      }),
    ).toEqual({ ok: true, output: { distanceDecimal: "-10" } });
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
    "rejects nonfinite firstSequence",
    (value) =>
      expect(tool.execute({ ...example.input, firstSequence: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondSequence",
    (value) =>
      expect(tool.execute({ ...example.input, secondSequence: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstEpoch: "1x" },
    { firstSequence: -1 },
    { firstSequence: 4294967296 },
    { secondSequence: -1 },
    { secondSequence: 4294967296 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstEpoch: "1x" },
    { firstSequence: -1 },
    { firstSequence: 4294967296 },
    { secondSequence: -1 },
    { secondSequence: 4294967296 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("explicit signed epochs preserve huge exact sequence distances", () => {
    const output = calculate({
      firstEpoch: "-9007199254740991",
      firstSequence: 4294967290,
      secondEpoch: "9007199254740991",
      secondSequence: 4,
    });
    expect(output).toMatchObject({
      distanceDecimal: "77371252455336254296293386",
    });
    expect(
      tool.execute({
        firstEpoch: "-9007199254740991",
        firstSequence: 4294967290,
        secondEpoch: "9007199254740991",
        secondSequence: 4,
      }),
    ).toEqual({ ok: true, output });
  });
});
