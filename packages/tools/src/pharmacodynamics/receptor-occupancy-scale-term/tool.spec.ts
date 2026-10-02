import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacodynamics/receptor-occupancy-scale-term", () => {
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
        suppliedOccupancy: 0.5,
        valueIsPercent: false,
        responseScale: -4,
        responseUnit: "bench-response",
      }),
    ).toEqual({
      ok: true,
      output: { fraction: 0.5, contribution: -2, unit: "bench-response" },
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
    "rejects nonfinite suppliedOccupancy",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedOccupancy: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite responseScale",
    (value) =>
      expect(tool.execute({ ...example.input, responseScale: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ suppliedOccupancy: 101 }, { responseUnit: "" }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ suppliedOccupancy: 101 }, { responseUnit: "" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("keeps a signed nonclinical response scale", () => {
    const output = calculate({
      suppliedOccupancy: 25,
      valueIsPercent: true,
      responseScale: -8,
      responseUnit: "bench-response",
    });
    expect(output).toMatchObject({
      fraction: 0.25,
      contribution: -2,
      unit: "bench-response",
    });
    expect(
      tool.execute({
        suppliedOccupancy: 25,
        valueIsPercent: true,
        responseScale: -8,
        responseUnit: "bench-response",
      }),
    ).toEqual({ ok: true, output });
  });
});
