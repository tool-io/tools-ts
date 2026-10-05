import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("visual-arts/canvas-crop-margin-layout", () => {
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
        canvasWidth: 50,
        canvasHeight: 50,
        cropLeft: 0,
        cropTop: 0,
        cropRight: 0,
        cropBottom: 0,
      }),
    ).toEqual({ ok: true, output: { croppedWidth: 50, croppedHeight: 50 } });
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
    "rejects nonfinite canvasWidth",
    (value) =>
      expect(tool.execute({ ...example.input, canvasWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite canvasHeight",
    (value) =>
      expect(tool.execute({ ...example.input, canvasHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cropLeft", (value) =>
    expect(tool.execute({ ...example.input, cropLeft: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cropTop", (value) =>
    expect(tool.execute({ ...example.input, cropTop: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cropRight", (value) =>
    expect(tool.execute({ ...example.input, cropRight: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cropBottom", (value) =>
    expect(tool.execute({ ...example.input, cropBottom: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { canvasWidth: -1 },
    { canvasHeight: -1 },
    { cropLeft: -1 },
    { cropTop: -1 },
    { cropRight: -1 },
    { cropBottom: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { canvasWidth: -1 },
    { canvasHeight: -1 },
    { cropLeft: -1 },
    { cropTop: -1 },
    { cropRight: -1 },
    { cropBottom: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
