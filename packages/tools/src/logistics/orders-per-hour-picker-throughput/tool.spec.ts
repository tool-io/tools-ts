import { describe, expect, it } from "vitest";
import {
  calculateOrdersPerHourPickerThroughput,
  ordersPerHourPickerThroughputExample,
  runOrdersPerHourPickerThroughput,
} from "./tool.js";

describe("orders-per-hour-picker-throughput", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOrdersPerHourPickerThroughput(
        ordersPerHourPickerThroughputExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ordersPerHourPickerThroughputExample.output,
    });
  });

  it("handles a partial-hour shift", () => {
    expect(
      runOrdersPerHourPickerThroughput({ ordersPicked: 55, pickerHours: 2.5 }),
    ).toEqual({ ok: true, output: { ordersPerHour: 22 } });
  });

  it("rejects zero picker hours", () => {
    const result = runOrdersPerHourPickerThroughput({
      ordersPicked: 10,
      pickerHours: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "pickerHours",
    });
  });

  it("rejects invalid counts and overflowing throughput", () => {
    expect(() =>
      calculateOrdersPerHourPickerThroughput({
        ordersPicked: 1.5,
        pickerHours: 1,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateOrdersPerHourPickerThroughput({
        ordersPicked: Number.MAX_SAFE_INTEGER,
        pickerHours: Number.MIN_VALUE,
      }),
    ).toThrow("too large to represent");
  });
});
