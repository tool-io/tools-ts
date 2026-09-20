import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvLeadingZeroPreservationFixture,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV leading zero preservation", () => {
  lightweightModelTests(
    tool,
    calculateCsvLeadingZeroPreservationFixture,
    example,
  );
  it("lightweight distinguishes code loss from the narrower ZIP-shaped warning", () => {
    expect(
      tool.execute({ count: 1, width: 2 }, { random: () => 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        codes: ["01"],
        textImportJson: '[{"code":"01"}]',
        numericImportJson: '[{"code":1}]',
        zipShapedRiskIndices: [],
      },
    });
  });
  it("lightweight rejects width and count resource boundaries", () => {
    expect(tool.execute({ ...example.input, width: 13 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "width", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
