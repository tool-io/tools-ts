import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ulamSpiralDiagonalInputSchema, ulamSpiralDiagonalOutputSchema } from "./index.js";

describe("math/ulam-spiral-diagonal", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ulamSpiralDiagonalInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ulamSpiralDiagonalOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      layer: "1",
    })).toEqual({ ok: true, output: {
      corners: ["9", "7", "5", "3"],
      diagonalSum: "25",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      layer: "0",
    })).toEqual({ ok: true, output: {
      corners: ["1"],
      diagonalSum: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "layer", code: "invalid_type" }] } });
    expect(tool.execute({
      layer: "2",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      layer: "-1",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "layer", code: "invalid_format" }] } });
  });

});
