import { describe, expect, it } from "vitest";
import {
  calculateDeferredRevenue,
  deferredRevenueExample,
  runDeferredRevenue,
} from "./tool.js";

describe("deferred revenue straight-line recognition", () => {
  it("executes its canonical example exactly", () => {
    expect(runDeferredRevenue(deferredRevenueExample.input)).toEqual({
      ok: true,
      output: deferredRevenueExample.output,
    });
  });

  it("fully recognizes a completed contract", () => {
    expect(
      calculateDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 24,
        monthsElapsed: 24,
      }),
    ).toEqual({
      monthlyRevenue: 2500,
      recognizedRevenue: 60000,
      remainingDeferredRevenue: 0,
    });
  });

  it("caps recognition beyond the contract length", () => {
    expect(
      calculateDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 24,
        monthsElapsed: 36,
      }),
    ).toEqual({
      monthlyRevenue: 2500,
      recognizedRevenue: 60000,
      remainingDeferredRevenue: 0,
    });
  });

  it("recognizes nothing before service starts", () => {
    expect(
      calculateDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 24,
        monthsElapsed: 0,
      }),
    ).toEqual({
      monthlyRevenue: 2500,
      recognizedRevenue: 0,
      remainingDeferredRevenue: 60000,
    });
  });

  it("keeps recognized plus deferred equal to the contract amount", () => {
    const result = calculateDeferredRevenue({
      contractAmount: 12345,
      contractMonths: 7,
      monthsElapsed: 3,
    });
    expect(
      result.recognizedRevenue + result.remainingDeferredRevenue,
    ).toBeCloseTo(12345, 9);
  });

  it("rejects malformed runtime input", () => {
    expect(
      runDeferredRevenue({ contractAmount: 60000, monthsElapsed: 5 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "contractMonths" }] },
    });
    expect(
      runDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 1.5,
        monthsElapsed: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "contractMonths" }] },
    });
    expect(
      runDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 24,
        monthsElapsed: 2.5,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "monthsElapsed" }] },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateDeferredRevenue({
        contractAmount: -1,
        contractMonths: 24,
        monthsElapsed: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateDeferredRevenue({
        contractAmount: 60000,
        contractMonths: 0,
        monthsElapsed: 0,
      }),
    ).toThrow();
  });
});
