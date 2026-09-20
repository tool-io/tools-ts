import { describe, expect, it } from "vitest";
import tool, { example, calculateQueueOperationTrace } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Queue trace", () => {
  lightweightModelTests(tool, calculateQueueOperationTrace, example);
  it("lightweight independently removes FIFO values and partitions retained state", () => {
    const result = tool.execute(
      {
        initialValues: ["a", "b", "c", "d"],
        values: ["x"],
        operations: ["dequeue"],
        eventCount: 1,
        pageSize: 2,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected queue");
    expect(result.output.events[0]?.value).toBe("a");
    expect(result.output.finalPages).toEqual([["b", "c"], ["d"]]);
  });
  it("lightweight rejects invalid page widths and history products", () => {
    expect(tool.execute({ ...example.input, pageSize: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "pageSize", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, eventCount: 64 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "eventCount", code: "resource_limit" }] },
    });
  });
});
