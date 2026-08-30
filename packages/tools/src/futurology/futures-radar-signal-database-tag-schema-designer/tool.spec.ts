import { describe, expect, it } from "vitest";
import {
  designFuturesRadarSignalSchema,
  futuresRadarSchemaExample,
  runFuturesRadarSchema,
} from "./tool.js";

describe("futures radar signal database tag schema designer", () => {
  it("reproduces its canonical example", () => {
    expect(runFuturesRadarSchema(futuresRadarSchemaExample.input)).toEqual({
      ok: true,
      output: futuresRadarSchemaExample.output,
    });
  });

  it("sorts and deduplicates the tag vocabulary", () => {
    expect(
      designFuturesRadarSignalSchema({
        signalRecords: [
          "A|energy|short|50|50|stable",
          "B|energy|short|50|50|stable",
        ],
      }).tagVocabulary,
    ).toEqual(["energy", "short", "stable"]);
  });

  it("returns the canonical schema fields", () => {
    expect(
      designFuturesRadarSignalSchema({
        signalRecords: ["A|domain|horizon|10|20|growing"],
      }).schemaFields,
    ).toHaveLength(6);
  });

  it("rejects a signal record with too few fields", () => {
    expect(
      runFuturesRadarSchema({ signalRecords: ["A|domain|horizon"] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_signal_record", field: "signalRecords.0" }],
      },
      ok: false,
    });
  });
});
