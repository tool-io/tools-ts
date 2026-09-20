import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvControlCharacterAuditFixture,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV lexical control audit", () => {
  lightweightModelTests(
    tool,
    calculateCsvControlCharacterAuditFixture,
    example,
  );
  it("lightweight independently counts UTF-16 offsets and preexisting controls", () => {
    const result = tool.execute(
      { fragments: ["😀\t"], codePoints: [10], count: 1 },
      { random: () => 0.99 },
    );
    if (!result.ok) throw new Error("Expected control fixture");
    expect(result.output.cases[0]).toMatchObject({
      offset: 3,
      mutated: "😀\t\n",
      audit: {
        matches: [
          { cell: 0, offset: 2, codePoint: 9 },
          { cell: 0, offset: 3, codePoint: 10 },
        ],
      },
    });
  });
  it("lightweight rejects unsupported control selections", () => {
    expect(tool.execute({ ...example.input, codePoints: [27] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "codePoints", code: "invalid_field" }] },
    });
  });
});
