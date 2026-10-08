import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cosmology/primordial-spectrum-pivot-amplitude-term", () => {
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
        pivotAmplitude: 3,
        waveNumber: 10,
        pivotWaveNumber: 2,
        spectralIndex: 1,
      }),
    ).toEqual({ ok: true, output: { powerAmplitude: 3 } });
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
    "rejects nonfinite pivotAmplitude",
    (value) =>
      expect(tool.execute({ ...example.input, pivotAmplitude: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite waveNumber", (value) =>
    expect(tool.execute({ ...example.input, waveNumber: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pivotWaveNumber",
    (value) =>
      expect(
        tool.execute({ ...example.input, pivotWaveNumber: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite spectralIndex",
    (value) =>
      expect(tool.execute({ ...example.input, spectralIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ pivotAmplitude: -1 }, { waveNumber: 0 }, { pivotWaveNumber: 0 }])(
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
  it.each([{ pivotAmplitude: -1 }, { waveNumber: 0 }, { pivotWaveNumber: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        pivotAmplitude: 2,
        waveNumber: 3,
        pivotWaveNumber: 3,
        spectralIndex: 0.9,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { powerAmplitude: 2 },
    });
    expect(calculate(input)).toEqual({ powerAmplitude: 2 });
  });
});
