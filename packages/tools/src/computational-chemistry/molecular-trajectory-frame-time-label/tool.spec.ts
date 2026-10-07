import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-chemistry/molecular-trajectory-frame-time-label", () => {
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
        frameIndex: 0,
        firstFrameIndex: 1,
        firstFrameTime: 10,
        timePerFrame: 2,
        unit: "fs",
      }),
    ).toEqual({ ok: true, output: { time: 8, label: "frame 0 at 8 fs" } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite frameIndex", (value) =>
    expect(tool.execute({ ...example.input, frameIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstFrameIndex",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstFrameIndex: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstFrameTime",
    (value) =>
      expect(tool.execute({ ...example.input, firstFrameTime: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite timePerFrame",
    (value) =>
      expect(tool.execute({ ...example.input, timePerFrame: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ frameIndex: -1 }, { firstFrameIndex: -1 }, { timePerFrame: 0 }])(
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
  it.each([{ frameIndex: -1 }, { firstFrameIndex: -1 }, { timePerFrame: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as Batch76DomainError } from "../../core/simple.js";
describe("batch 76 reviewed regressions", () => {
  it.each(["unit"])("identifies an empty required text field %s", (field) => {
    expect(tool.execute({ ...example.input, [field]: "" })).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field, code: "invalid_field" }],
      },
    });
    expect(() => calculate({ ...example.input, [field]: "" })).toThrowError(
      Batch76DomainError,
    );
  });
});
