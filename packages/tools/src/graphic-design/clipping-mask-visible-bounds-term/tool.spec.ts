import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("graphic-design/clipping-mask-visible-bounds-term", () => {
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
        left: 0,
        top: 0,
        right: 2,
        bottom: 2,
        maskLeft: 3,
        maskTop: 3,
        maskRight: 4,
        maskBottom: 4,
      }),
    ).toEqual({
      ok: true,
      output: {
        left: 3,
        top: 3,
        right: 3,
        bottom: 3,
        width: 0,
        height: 0,
        hasArea: false,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite left", (value) =>
    expect(tool.execute({ ...example.input, left: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite top", (value) =>
    expect(tool.execute({ ...example.input, top: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite right", (value) =>
    expect(tool.execute({ ...example.input, right: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite bottom", (value) =>
    expect(tool.execute({ ...example.input, bottom: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite maskLeft", (value) =>
    expect(tool.execute({ ...example.input, maskLeft: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite maskTop", (value) =>
    expect(tool.execute({ ...example.input, maskTop: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite maskRight", (value) =>
    expect(tool.execute({ ...example.input, maskRight: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite maskBottom", (value) =>
    expect(tool.execute({ ...example.input, maskBottom: value }).ok).toBe(
      false,
    ),
  );
});
