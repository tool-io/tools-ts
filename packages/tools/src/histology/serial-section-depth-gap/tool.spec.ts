import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("histology/serial-section-depth-gap", () => {
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
        firstSection: 5,
        secondSection: 2,
        sectionThickness: 2,
        interSectionGap: 1,
        suppliedDepthDifference: -9,
      }),
    ).toEqual({ ok: true, output: { modelDepthDifference: -9, residual: 0 } });
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
    "rejects nonfinite firstSection",
    (value) =>
      expect(tool.execute({ ...example.input, firstSection: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondSection",
    (value) =>
      expect(tool.execute({ ...example.input, secondSection: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sectionThickness",
    (value) =>
      expect(
        tool.execute({ ...example.input, sectionThickness: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite interSectionGap",
    (value) =>
      expect(
        tool.execute({ ...example.input, interSectionGap: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedDepthDifference",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedDepthDifference: value }).ok,
      ).toBe(false),
  );
  it.each([
    { firstSection: -1 },
    { secondSection: -1 },
    { sectionThickness: 0 },
    { interSectionGap: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstSection: -1 },
    { secondSection: -1 },
    { sectionThickness: 0 },
    { interSectionGap: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("reverse section order retains negative depth differences", () => {
    const output = calculate({
      firstSection: 5,
      secondSection: 2,
      sectionThickness: 2,
      interSectionGap: 1,
      suppliedDepthDifference: -9,
    });
    expect(output).toMatchObject({ modelDepthDifference: -9, residual: 0 });
    expect(
      tool.execute({
        firstSection: 5,
        secondSection: 2,
        sectionThickness: 2,
        interSectionGap: 1,
        suppliedDepthDifference: -9,
      }),
    ).toEqual({ ok: true, output });
  });
});
