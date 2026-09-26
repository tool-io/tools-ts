import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-engineering/biofilter-one-layer-pressure-drop", () => {
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
        viscousCoefficient: 4,
        inertialCoefficient: 1,
        velocity: -2,
        depth: 2,
      }),
    ).toEqual({
      ok: true,
      output: { viscousDrop: -16, inertialDrop: -8, totalDrop: -24 },
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
    "rejects nonfinite viscousCoefficient",
    (value) =>
      expect(
        tool.execute({ ...example.input, viscousCoefficient: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite inertialCoefficient",
    (value) =>
      expect(
        tool.execute({ ...example.input, inertialCoefficient: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite velocity", (value) =>
    expect(tool.execute({ ...example.input, velocity: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite depth", (value) =>
    expect(tool.execute({ ...example.input, depth: value }).ok).toBe(false),
  );
  it.each([
    { viscousCoefficient: -1 },
    { inertialCoefficient: -1 },
    { depth: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
