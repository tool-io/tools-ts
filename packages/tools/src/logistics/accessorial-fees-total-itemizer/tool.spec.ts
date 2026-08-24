import { describe, expect, it } from "vitest";
import {
  accessorialFeesTotalItemizerExample,
  calculateAccessorialFeesTotalItemizer,
  runAccessorialFeesTotalItemizer,
} from "./tool.js";

describe("accessorial-fees-total-itemizer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAccessorialFeesTotalItemizer(
        accessorialFeesTotalItemizerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: accessorialFeesTotalItemizerExample.output,
    });
  });

  it("totals zero when no fees are supplied", () => {
    const result = runAccessorialFeesTotalItemizer({});
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalAccessorialUsd).toBe(0);
    expect(result.output.appliedCount).toBe(0);
  });

  it("sums all six line-item categories and counts only positive fees", () => {
    expect(
      calculateAccessorialFeesTotalItemizer({
        appointmentSchedulingUsd: 6,
        insideDeliveryUsd: 3,
        liftgateUsd: 1,
        limitedAccessUsd: 4,
        otherUsd: 0,
        residentialDeliveryUsd: 2,
      }),
    ).toEqual({ appliedCount: 5, totalAccessorialUsd: 16 });
  });

  it("rejects a negative fee with a field-specific issue", () => {
    expect(() =>
      calculateAccessorialFeesTotalItemizer({ otherUsd: -0.01 }),
    ).toThrow("Fees cannot be negative.");

    const result = runAccessorialFeesTotalItemizer({ liftgateUsd: -5 });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({ code: "invalid_field", field: "liftgateUsd" }),
    ]);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite fees through the public runner (%s)",
    (liftgateUsd) => {
      const result = runAccessorialFeesTotalItemizer({ liftgateUsd });
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected failure");
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          code: "invalid_field",
          field: "liftgateUsd",
        }),
      ]);
    },
  );

  it("rejects totals that overflow a finite number", () => {
    const result = runAccessorialFeesTotalItemizer({
      liftgateUsd: Number.MAX_VALUE,
      residentialDeliveryUsd: 1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues).toEqual([
      expect.objectContaining({
        code: "fee_total_overflow",
        field: "residentialDeliveryUsd",
      }),
    ]);
  });
});
