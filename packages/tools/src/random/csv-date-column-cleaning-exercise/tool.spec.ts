import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvDateColumnCleaningExercise,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV date cleaning", () => {
  lightweightModelTests(tool, calculateCsvDateColumnCleaningExercise, example);
  it("lightweight retains ambiguous slash dates and explicit ISO answers", () => {
    const result = tool.execute(
      { isoDates: ["2000-02-03"], formats: ["DD/MM/YYYY"] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected valid leap-century date");
    expect(result.output.cells).toEqual([
      {
        token: "03/02/2000",
        iso: "2000-02-03",
        format: "DD/MM/YYYY",
        compatibleFormats: ["MM/DD/YYYY", "DD/MM/YYYY"],
      },
    ]);
  });
  it("lightweight rejects fictitious Gregorian and terminal-LF dates", () => {
    expect(
      tool.execute({ ...example.input, isoDates: ["1900-02-29"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "isoDates.0", code: "invalid_date" }] },
    });
    expect(
      tool.execute({ ...example.input, isoDates: ["2024-02-29\n"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "isoDates", code: "invalid_field" }] },
    });
  });
});
