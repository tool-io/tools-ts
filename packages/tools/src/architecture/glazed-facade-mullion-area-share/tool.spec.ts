import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("architecture/glazed-facade-mullion-area-share", () => {
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
        width: 4,
        height: 3,
        verticalCount: 1,
        verticalWidth: 0.2,
        horizontalCount: 1,
        horizontalWidth: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: {
        frameArea: 0.98,
        frameFraction: 0.08166666666666667,
        clearArea: 11.02,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite width", (value) =>
    expect(tool.execute({ ...example.input, width: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite height", (value) =>
    expect(tool.execute({ ...example.input, height: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite verticalCount",
    (value) =>
      expect(tool.execute({ ...example.input, verticalCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite verticalWidth",
    (value) =>
      expect(tool.execute({ ...example.input, verticalWidth: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite horizontalCount",
    (value) =>
      expect(
        tool.execute({ ...example.input, horizontalCount: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite horizontalWidth",
    (value) =>
      expect(
        tool.execute({ ...example.input, horizontalWidth: value }).ok,
      ).toBe(false),
  );
  it.each([
    { width: 0 },
    { height: 0 },
    { verticalCount: -1 },
    { verticalWidth: -1 },
    { horizontalCount: -1 },
    { horizontalWidth: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
