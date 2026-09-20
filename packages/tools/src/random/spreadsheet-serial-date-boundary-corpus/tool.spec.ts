import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateSpreadsheetSerialDateBoundaryCorpus,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Spreadsheet serial boundaries", () => {
  lightweightModelTests(
    tool,
    calculateSpreadsheetSerialDateBoundaryCorpus,
    example,
  );
  it("lightweight independently preserves the 1900 gap and 1904 epoch", () => {
    const result = tool.execute(
      { system: "1900", startSerial: 60, radius: 1, count: 2 },
      {
        random: (() => {
          const draws = [0, 0.999];
          return () => draws.shift() ?? 0;
        })(),
      },
    );
    if (!result.ok) throw new Error("Expected boundaries");
    expect(result.output.cases).toEqual([
      {
        serial: 59,
        isoDate: "1900-02-28",
        errorCode: null,
        roundTripSerial: 59,
      },
      {
        serial: 61,
        isoDate: "1900-03-01",
        errorCode: null,
        roundTripSerial: 61,
      },
    ]);
    expect(
      tool.execute({
        system: "1904",
        startSerial: 0,
        radius: 0,
        count: 1,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            serial: 0,
            isoDate: "1904-01-01",
            errorCode: null,
            roundTripSerial: 0,
          },
        ],
      },
    });
  });
  it("lightweight rejects unsafe boundary arithmetic and fractional serials", () => {
    expect(
      tool.execute({ ...example.input, startSerial: Number.MAX_SAFE_INTEGER }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "startSerial", code: "unsafe_aggregate" }] },
    });
    expect(tool.execute({ ...example.input, startSerial: 1.5 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "startSerial", code: "invalid_field" }] },
    });
  });
});
