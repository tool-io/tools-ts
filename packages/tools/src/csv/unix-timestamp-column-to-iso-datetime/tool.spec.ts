import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, unixTimestampColumnToIsoDatetimeInputSchema, unixTimestampColumnToIsoDatetimeOutputSchema } from "./index.js";
describe("csv/unix-timestamp-column-to-iso-datetime", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, unixTimestampColumnToIsoDatetimeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, unixTimestampColumnToIsoDatetimeOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "-1",
        "1001"
      ],
      "unit": "milliseconds"
    })).toEqual({ ok: true, output: {
      "isoDatetimes": [
        "1969-12-31T23:59:59.999Z",
        "1970-01-01T00:00:01.001Z"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [],
      "unit": "seconds"
    })).toEqual({ ok: true, output: {
      "isoDatetimes": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "values": [
        "1.5"
      ],
      "unit": "seconds"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_timestamp" }] } });
    expect(tool.execute({
      "values": [
        "253402300800000"
      ],
      "unit": "milliseconds"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "date_range" }] } });
  });

});
