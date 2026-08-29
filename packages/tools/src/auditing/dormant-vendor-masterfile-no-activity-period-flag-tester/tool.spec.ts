import { describe, expect, it } from "vitest";
import {
  dormantVendorExample,
  findDormantVendors,
  runDormantVendor,
} from "./tool.js";

describe("dormant vendor masterfile flag tester", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDormantVendor(dormantVendorExample.input)).toEqual({
      ok: true,
      output: dormantVendorExample.output,
    });
  });

  it("flags a vendor exactly at the threshold", () => {
    expect(
      findDormantVendors({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [{ lastActivity: "2025-12-02", vendor: "Edge" }],
      }),
    ).toEqual({
      dormantIndices: [0],
      dormantVendors: 1,
      oldestDormantDays: 30,
    });
  });

  it("keeps a vendor one day inside the threshold unflagged", () => {
    expect(
      findDormantVendors({
        asOf: "2026-01-01",
        dormantDays: 31,
        vendors: [{ lastActivity: "2025-12-02", vendor: "Edge" }],
      }),
    ).toEqual({ dormantIndices: [], dormantVendors: 0, oldestDormantDays: 0 });
  });

  it("tracks the oldest dormant vendor across entries", () => {
    expect(
      findDormantVendors({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [
          { lastActivity: "2025-11-01", vendor: "Older" },
          { lastActivity: "2025-12-01", vendor: "Newer" },
        ],
      }),
    ).toEqual({
      dormantIndices: [0, 1],
      dormantVendors: 2,
      oldestDormantDays: 61,
    });
  });

  it("rejects a non-positive dormancy threshold", () => {
    expect(
      runDormantVendor({
        asOf: "2026-01-01",
        dormantDays: 0,
        vendors: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dormant_days", field: "dormantDays" }],
      },
      ok: false,
    });
  });

  it("rejects a malformed last-activity date", () => {
    expect(
      runDormantVendor({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [{ lastActivity: "12/01/2025", vendor: "A" }],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_last_activity", field: "vendors.0.lastActivity" },
        ],
      },
      ok: false,
    });
  });

  it("rejects a blank vendor name", () => {
    expect(
      runDormantVendor({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [{ lastActivity: "2025-01-01", vendor: " " }],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_vendor_name", field: "vendors.0.vendor" }],
      },
      ok: false,
    });
  });

  it("rejects activity after the as-of date", () => {
    expect(
      runDormantVendor({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [{ lastActivity: "2026-01-02", vendor: "Future Entry" }],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "activity_after_as_of",
            field: "vendors.0.lastActivity",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects an unevaluable vendor without an activity date", () => {
    expect(
      runDormantVendor({
        asOf: "2026-01-01",
        dormantDays: 30,
        vendors: [{ lastActivity: null, vendor: "Never Used Vendor" }],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_last_activity",
            field: "vendors.0.lastActivity",
          },
        ],
      },
      ok: false,
    });
  });
});
