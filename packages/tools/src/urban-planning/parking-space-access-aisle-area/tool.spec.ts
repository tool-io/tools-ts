import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("urban-planning/parking-space-access-aisle-area", () => {
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
        spaceWidth: 3,
        spaceLength: 5,
        aisleWidth: 6,
        spaces: 4,
        aisleSharedSides: 1,
      }),
    ).toEqual({
      ok: true,
      output: { spaceArea: 60, allocatedAisleArea: 72, totalArea: 132 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite spaceWidth", (value) =>
    expect(tool.execute({ ...example.input, spaceWidth: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite spaceLength",
    (value) =>
      expect(tool.execute({ ...example.input, spaceLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite aisleWidth", (value) =>
    expect(tool.execute({ ...example.input, aisleWidth: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite spaces", (value) =>
    expect(tool.execute({ ...example.input, spaces: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite aisleSharedSides",
    (value) =>
      expect(
        tool.execute({ ...example.input, aisleSharedSides: value }).ok,
      ).toBe(false),
  );
  it.each([
    { spaceWidth: -1 },
    { spaceLength: -1 },
    { aisleWidth: -1 },
    { spaces: -1 },
    { aisleSharedSides: 0 },
    { aisleSharedSides: 3 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
