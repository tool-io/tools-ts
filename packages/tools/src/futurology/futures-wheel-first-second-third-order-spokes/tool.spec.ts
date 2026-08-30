import { describe, expect, it } from "vitest";
import {
  futuresWheelExample,
  mapFuturesWheelSpokes,
  runFuturesWheel,
} from "./tool.js";

describe("futures wheel order spokes", () => {
  it("reproduces its canonical example", () => {
    expect(runFuturesWheel(futuresWheelExample.input)).toEqual({
      ok: true,
      output: futuresWheelExample.output,
    });
  });

  it("reports an unrepresented order", () => {
    expect(
      mapFuturesWheelSpokes({ orderAssignments: [1, 1], spokes: ["A", "B"] }),
    ).toMatchObject({
      complete: false,
      missingOrders: [2, 3],
      orderCounts: [2, 0, 0],
    });
  });

  it("counts multiple spokes in one order", () => {
    expect(
      mapFuturesWheelSpokes({
        orderAssignments: [1, 2, 3],
        spokes: ["A", "B", "C"],
      }).orderCounts,
    ).toEqual([1, 1, 1]);
  });

  it("rejects an order code outside one through three", () => {
    expect(
      runFuturesWheel({ orderAssignments: [4], spokes: ["A"] }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_order_assignment", field: "orderAssignments.0" },
        ],
      },
      ok: false,
    });
  });
});
