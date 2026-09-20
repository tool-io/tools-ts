import { describe, expect, it } from "vitest";
import tool, { example, calculateBinarySearchBoundaryCorpus } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Binary search bounds", () => {
  lightweightModelTests(tool, calculateBinarySearchBoundaryCorpus, example);
  it("lightweight independently partitions an entire duplicate run and absent endpoints", () => {
    const result = tool.execute(
      { length: 3, minimumValue: 2, maximumValue: 2, targets: [] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected corpus");
    expect(result.output.queries).toEqual([
      { target: 2, lower: 0, upper: 3, count: 3 },
      { target: 1, lower: 0, upper: 0, count: 0 },
      { target: 3, lower: 3, upper: 3, count: 0 },
    ]);
  });
  it("lightweight reports an unrepresentable absent endpoint and invalid length", () => {
    expect(
      tool.execute({
        ...example.input,
        length: 1,
        minimumValue: Number.MAX_SAFE_INTEGER,
        maximumValue: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumValue", code: "unsafe_aggregate" }] },
    });
    expect(tool.execute({ ...example.input, length: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "length", code: "invalid_field" }] },
    });
  });
});
