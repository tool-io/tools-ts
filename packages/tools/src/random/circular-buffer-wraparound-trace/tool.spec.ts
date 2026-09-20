import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCircularBufferWraparoundTrace,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Circular buffer trace", () => {
  lightweightModelTests(tool, calculateCircularBufferWraparoundTrace, example);
  it("lightweight independently rejects a full write while retaining wrapped indices", () => {
    const result = tool.execute(
      {
        capacity: 1,
        operations: ["write"],
        eventCount: 2,
        minimumValue: 7,
        maximumValue: 7,
        overflowPolicy: "reject",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected buffer");
    expect(result.output.events[0]).toMatchObject({
      head: 0,
      tail: 0,
      size: 1,
      accepted: true,
    });
    expect(result.output.events[1]).toMatchObject({
      head: 0,
      tail: 0,
      size: 1,
      accepted: false,
      overflow: true,
      cells: [7],
    });
    expect(result.output.finalValues).toEqual([7]);
  });
  it("lightweight labels empty reads and rejects zero capacity", () => {
    expect(
      tool.execute({ ...example.input, operations: ["read"], eventCount: 1 }),
    ).toMatchObject({
      ok: true,
      output: {
        events: [{ value: null, underflow: true, accepted: false, size: 0 }],
      },
    });
    expect(tool.execute({ ...example.input, capacity: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "capacity", code: "invalid_field" }] },
    });
  });
});
