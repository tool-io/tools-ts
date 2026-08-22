import { describe, expect, it } from "vitest";
import { runFiscalQuarter } from "./tool.js";

describe("Fiscal Quarter Calculator", () => {
  it("matches calendar quarters for a January start", () => {
    expect(runFiscalQuarter({ date: "2024-03-15", startMonth: 1 })).toEqual({
      ok: true,
      output: { quarter: 1 },
    });
    expect(runFiscalQuarter({ date: "2024-12-31", startMonth: 1 })).toEqual({
      ok: true,
      output: { quarter: 4 },
    });
  });

  it("shifts quarters for a July fiscal year start", () => {
    expect(runFiscalQuarter({ date: "2024-08-01", startMonth: 7 })).toEqual({
      ok: true,
      output: { quarter: 1 },
    });
    expect(runFiscalQuarter({ date: "2024-06-30", startMonth: 7 })).toEqual({
      ok: true,
      output: { quarter: 4 },
    });
  });

  it("rejects invalid input", () =>
    expect(runFiscalQuarter(null).ok).toBe(false));
});
