import { describe, expect, it } from "vitest";
import {
  calculateOperatingCycle,
  operatingCycleExample,
  runOperatingCycle,
} from "./tool.js";

describe("operating cycle", () => {
  it("executes its canonical example exactly", () => {
    expect(runOperatingCycle(operatingCycleExample.input)).toEqual({
      ok: true,
      output: operatingCycleExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateOperatingCycle({
        daysInventoryOutstanding: 73,
        daysSalesOutstanding: 47,
      }),
    ).toEqual({ operatingCycleDays: 120 });
  });

  it("treats zero components as a zero cycle without negative zero", () => {
    expect(
      calculateOperatingCycle({
        daysInventoryOutstanding: 0,
        daysSalesOutstanding: 0,
      }),
    ).toEqual({ operatingCycleDays: 0 });
    expect(
      calculateOperatingCycle({
        daysInventoryOutstanding: 0,
        daysSalesOutstanding: -0,
      }).operatingCycleDays,
    ).toBe(0);
  });

  it("is additive in each component", () => {
    const base = calculateOperatingCycle({
      daysInventoryOutstanding: 60,
      daysSalesOutstanding: 30,
    });
    const shifted = calculateOperatingCycle({
      daysInventoryOutstanding: 90,
      daysSalesOutstanding: 30,
    });
    expect(shifted.operatingCycleDays - base.operatingCycleDays).toBe(30);
  });

  it("rejects negative day counts at the schema boundary", () => {
    expect(
      runOperatingCycle({
        daysInventoryOutstanding: -1,
        daysSalesOutstanding: 30,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysInventoryOutstanding" }],
      },
    });
  });

  it("rejects negative and non-finite direct input", () => {
    expect(() =>
      calculateOperatingCycle({
        daysInventoryOutstanding: -1,
        daysSalesOutstanding: 30,
      }),
    ).toThrow();
    expect(() =>
      calculateOperatingCycle({
        daysInventoryOutstanding: 60,
        daysSalesOutstanding: NaN,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(runOperatingCycle({ daysInventoryOutstanding: 60 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysSalesOutstanding" }],
      },
    });
    expect(
      runOperatingCycle({
        daysInventoryOutstanding: "60",
        daysSalesOutstanding: 30,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysInventoryOutstanding" }],
      },
    });
  });
});
