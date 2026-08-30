import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, scientificNotationGeneNameDateGuardInputSchema, scientificNotationGeneNameDateGuardOutputSchema } from "./index.js";
describe("csv/scientific-notation-gene-name-date-guard", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, scientificNotationGeneNameDateGuardInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, scientificNotationGeneNameDateGuardOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "DEC1",
        "SEPTIN1"
      ]
    })).toEqual({ ok: true, output: {
      "risks": [
        {
          "cell": 0,
          "reason": "legacy_date_like_symbol"
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "risks": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
