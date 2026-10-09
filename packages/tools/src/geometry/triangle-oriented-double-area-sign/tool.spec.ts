import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geometry/triangle-oriented-double-area-sign", () => {
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
    expect(tool.execute({ ax: 0, ay: 0, bx: 1, by: 3, cx: 4, cy: 0 })).toEqual({
      ok: true,
      output: { orientedDoubleArea: -12, orientation: -1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ax", (value) =>
    expect(tool.execute({ ...example.input, ax: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite ay", (value) =>
    expect(tool.execute({ ...example.input, ay: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bx", (value) =>
    expect(tool.execute({ ...example.input, bx: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite by", (value) =>
    expect(tool.execute({ ...example.input, by: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cx", (value) =>
    expect(tool.execute({ ...example.input, cx: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cy", (value) =>
    expect(tool.execute({ ...example.input, cy: value }).ok).toBe(false),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ ax: 0, ay: 0, bx: 1, by: 1, cx: 2, cy: 2 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { orientedDoubleArea: 0, orientation: 0 },
    });
    expect(calculate(input)).toEqual({ orientedDoubleArea: 0, orientation: 0 });
  });
});
