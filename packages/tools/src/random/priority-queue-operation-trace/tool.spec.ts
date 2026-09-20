import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculatePriorityQueueOperationTrace,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Priority queue heap trace", () => {
  lightweightModelTests(tool, calculatePriorityQueueOperationTrace, example);
  it("lightweight independently extracts equal priorities in insertion order", () => {
    const result = tool.execute(
      {
        initialPriorities: [4, 1, 1],
        operations: ["extract"],
        eventCount: 4,
        minimumPriority: 0,
        maximumPriority: 4,
        tieBreak: "oldest",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected heap");
    expect(
      result.output.events.map((event) => event.entry?.id ?? null),
    ).toEqual([1, 2, 0, null]);
    expect(result.output.events[3]?.missing).toBe(true);
    for (const event of result.output.events)
      for (let child = 1; child < event.heap.length; child += 1) {
        const parent = event.heap[Math.floor((child - 1) / 2)],
          node = event.heap[child];
        if (!parent || !node) throw new Error("Missing heap snapshot entry");
        expect(parent.priority <= node.priority).toBe(true);
      }
  });
  it("lightweight supports newest ties and rejects priority range reversal", () => {
    expect(
      tool.execute({
        ...example.input,
        initialPriorities: [2, 2],
        operations: ["extract"],
        eventCount: 1,
        tieBreak: "newest",
      }),
    ).toMatchObject({
      ok: true,
      output: { events: [{ entry: { id: 1, priority: 2 } }] },
    });
    expect(
      tool.execute({ ...example.input, minimumPriority: 4 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumPriority", code: "invalid_integer_range" }],
      },
    });
    const zero = tool.execute({
      ...example.input,
      initialPriorities: [-0],
      operations: ["extract"],
      eventCount: 1,
    });
    if (!zero.ok) throw new Error("Expected zero-priority entry");
    expect(Object.is(zero.output.events[0]?.entry?.priority, 0)).toBe(true);
  });
});
