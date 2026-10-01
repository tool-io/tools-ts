import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("network/tcp-retransmission-sequence-overlap", () => {
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
        firstStart: 100,
        firstLength: 20,
        secondStart: 110,
        secondLength: 20,
      }),
    ).toEqual({ ok: true, output: { overlapBytes: 10, secondOffset: 10 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstStart", (value) =>
    expect(tool.execute({ ...example.input, firstStart: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstLength",
    (value) =>
      expect(tool.execute({ ...example.input, firstLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondStart",
    (value) =>
      expect(tool.execute({ ...example.input, secondStart: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondLength",
    (value) =>
      expect(tool.execute({ ...example.input, secondLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstStart: 0, secondStart: 2147483648 },
    { firstStart: -1 },
    { firstStart: 4294967296 },
    { firstLength: -1 },
    { firstLength: 2147483648 },
    { secondStart: -1 },
    { secondStart: 4294967296 },
    { secondLength: -1 },
    { secondLength: 2147483648 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstStart: 0, secondStart: 2147483648 },
    { firstStart: -1 },
    { firstStart: 4294967296 },
    { firstLength: -1 },
    { firstLength: 2147483648 },
    { secondStart: -1 },
    { secondStart: 4294967296 },
    { secondLength: -1 },
    { secondLength: 2147483648 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 69 reviewed regressions

it("crosses sequence zero and rejects an ambiguous half-space separation", () => {
  expect(
    calculate({
      firstStart: 4294967290,
      firstLength: 10,
      secondStart: 0,
      secondLength: 8,
    }),
  ).toEqual({ overlapBytes: 4, secondOffset: 6 });
  expect(
    tool.execute({
      firstStart: 0,
      firstLength: 10,
      secondStart: 2147483648,
      secondLength: 8,
    }),
  ).toMatchObject({ ok: false, error: { code: "invalid_input" } });
});
