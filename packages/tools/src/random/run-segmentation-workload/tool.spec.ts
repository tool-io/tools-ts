import { describe, expect, it } from "vitest";
import tool, { example, calculateRunSegmentationWorkload } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Token run segmentation", () => {
  lightweightModelTests(tool, calculateRunSegmentationWorkload, example);
  it("lightweight independently reconstructs fixed-length alternating runs", () => {
    const result = tool.execute(
      {
        tokens: ["x", "y"],
        runCount: 3,
        minimumRunLength: 2,
        maximumRunLength: 2,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected runs");
    expect(result.output.stream).toEqual(["x", "x", "y", "y", "x", "x"]);
    expect(result.output.boundaries).toEqual([0, 2, 4, 6]);
    expect(result.output.counts).toEqual([
      { key: "x", count: 4 },
      { key: "y", count: 2 },
    ]);
    expect(
      result.output.segments.flatMap((segment) =>
        result.output.stream.slice(segment.start, segment.endExclusive),
      ),
    ).toEqual(result.output.stream);
  });
  it("lightweight rejects reversed run bounds and count limits", () => {
    expect(
      tool.execute({ ...example.input, minimumRunLength: 4 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumRunLength", code: "invalid_run_range" }],
      },
    });
    expect(tool.execute({ ...example.input, runCount: 17 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "runCount", code: "invalid_field" }] },
    });
  });
});
