import { describe, expect, it } from "vitest";
import {
  orderToDoorResponseTimeExample,
  runOrderToDoorResponseTime,
} from "./tool.js";

describe("logistics/order-to-door-response-time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOrderToDoorResponseTime(orderToDoorResponseTimeExample.input),
    ).toEqual({ ok: true, output: orderToDoorResponseTimeExample.output });
  });

  it("meets a relaxed target on the same order", () => {
    const result = runOrderToDoorResponseTime({
      deliveredAt: "2026-05-05T17:45:00Z",
      orderPlacedAt: "2026-05-04T09:15:00Z",
      targetHours: 48,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.slaMet).toBe(true);
    expect(result.output.elapsedHours as number).toBe(32.5);
  });

  it("rejects a delivery before the order", () => {
    expect(
      runOrderToDoorResponseTime({
        deliveredAt: "2026-05-04T00:00:00Z",
        orderPlacedAt: "2026-05-05T00:00:00Z",
      }).ok,
    ).toBe(false);
  });

  it("rejects normalized but impossible calendar dates", () => {
    expect(
      runOrderToDoorResponseTime({
        deliveredAt: "2026-03-02T00:00:00Z",
        orderPlacedAt: "2026-02-30T00:00:00Z",
      }).ok,
    ).toBe(false);
  });
});
