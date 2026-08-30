import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, phoneDigitsNormalizeBasicE164LiteInputSchema, phoneDigitsNormalizeBasicE164LiteOutputSchema } from "./index.js";
describe("csv/phone-digits-normalize-basic-e164-lite", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, phoneDigitsNormalizeBasicE164LiteInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, phoneDigitsNormalizeBasicE164LiteOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "+123456789012345"
      ],
      "countryCode": "1"
    })).toEqual({ ok: true, output: {
      "values": [
        "+123456789012345"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [],
      "countryCode": "1"
    })).toEqual({ ok: true, output: {
      "values": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "values": [
        "+1234567890123456"
      ],
      "countryCode": "1"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_phone" }] } });
    expect(tool.execute({
      "values": [
        "+1+23"
      ],
      "countryCode": "1"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_phone" }] } });
    expect(tool.execute({
      "values": [
        "ext 2"
      ],
      "countryCode": "1"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_phone" }] } });
  });

});
