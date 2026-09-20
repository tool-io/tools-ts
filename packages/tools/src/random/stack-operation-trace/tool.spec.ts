import { describe, expect, it } from "vitest";
import tool, { example, calculateStackOperationTrace } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Stack trace", () => {
  lightweightModelTests(tool, calculateStackOperationTrace, example);
  it("lightweight independently removes LIFO values before labeled underflow", () => {
    const result = tool.execute(
      {
        initialValues: ["old", "new"],
        values: ["x"],
        operations: ["pop"],
        eventCount: 3,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected trace");
    expect(
      result.output.events.map((event) => [event.value, event.underflow]),
    ).toEqual([
      ["new", false],
      ["old", false],
      [null, true],
    ]);
    expect(result.output.finalStack).toEqual([]);
  });
  it("lightweight rejects snapshot product and duplicate operations", () => {
    expect(tool.execute({ ...example.input, eventCount: 64 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "eventCount", code: "resource_limit" }] },
    });
    expect(
      tool.execute({ ...example.input, operations: ["push", "push"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "operations", code: "duplicate_entries" }] },
    });
  });
});
