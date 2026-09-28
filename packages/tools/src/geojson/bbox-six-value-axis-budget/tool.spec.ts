import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geojson/bbox-six-value-axis-budget", () => {
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
    expect(tool.execute({ bbox: [0, 0, -5, 10, 5, 5] })).toEqual({
      ok: true,
      output: {
        longitudeSpan: 10,
        latitudeSpan: 5,
        verticalSpan: 10,
        crossesAntimeridian: false,
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
});

// batch 68 regression review

it("uses the antimeridian span rather than a negative longitude width", () => {
  expect(calculate({ bbox: [177, -20, 0, -178, -16, 10] })).toEqual({
    longitudeSpan: 5,
    latitudeSpan: 4,
    verticalSpan: 10,
    crossesAntimeridian: true,
  });
  expect(tool.execute({ bbox: [0, 91, 0, 10, 92, 10] })).toMatchObject({
    ok: false,
    error: { code: "invalid_input" },
  });
});
