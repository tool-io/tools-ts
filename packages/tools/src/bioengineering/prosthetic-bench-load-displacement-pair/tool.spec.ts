import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioengineering/prosthetic-bench-load-displacement-pair", () => {
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
        beforeForceNewtons: 0,
        afterForceNewtons: 20,
        beforeDisplacementMillimeters: 0,
        afterDisplacementMillimeters: 4,
      }),
    ).toEqual({
      ok: true,
      output: {
        forceChangeNewtons: 20,
        displacementChangeMillimeters: 4,
        secantStiffnessNewtonsPerMillimeter: 5,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite beforeForceNewtons",
    (value) =>
      expect(
        tool.execute({ ...example.input, beforeForceNewtons: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite afterForceNewtons",
    (value) =>
      expect(
        tool.execute({ ...example.input, afterForceNewtons: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite beforeDisplacementMillimeters",
    (value) =>
      expect(
        tool.execute({ ...example.input, beforeDisplacementMillimeters: value })
          .ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite afterDisplacementMillimeters",
    (value) =>
      expect(
        tool.execute({ ...example.input, afterDisplacementMillimeters: value })
          .ok,
      ).toBe(false),
  );
});
