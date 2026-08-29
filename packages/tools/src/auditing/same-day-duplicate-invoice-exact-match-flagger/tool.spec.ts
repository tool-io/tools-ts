import { describe, expect, it } from "vitest";
import {
  findSameDayDuplicateInvoices,
  runSameDayDuplicateInvoice,
  sameDayDuplicateInvoiceExample,
} from "./tool.js";

describe("same-day duplicate invoice exact-match flagger", () => {
  it("reproduces its canonical example", () => {
    expect(
      runSameDayDuplicateInvoice(sameDayDuplicateInvoiceExample.input),
    ).toEqual({ ok: true, output: sameDayDuplicateInvoiceExample.output });
  });

  it("groups case-insensitive vendor matches by input order", () => {
    expect(
      findSameDayDuplicateInvoices({
        invoices: [
          { amount: 500, date: "2026-01-10", vendor: "Northwind" },
          { amount: 500, date: "2026-01-10", vendor: "northwind" },
          { amount: 500, date: "2026-01-11", vendor: "Northwind" },
        ],
      }),
    ).toEqual({
      duplicateGroups: 1,
      duplicateIndices: [[0, 1]],
      duplicates: 2,
    });
  });

  it("reports two distinct groups with ordered indices", () => {
    expect(
      findSameDayDuplicateInvoices({
        invoices: [
          { amount: 10, date: "2026-02-01", vendor: "A" },
          { amount: 20, date: "2026-02-01", vendor: "B" },
          { amount: 20, date: "2026-02-01", vendor: "b" },
          { amount: 10, date: "2026-02-02", vendor: "A" },
          { amount: 10, date: "2026-02-02", vendor: "A" },
        ],
      }),
    ).toEqual({
      duplicateGroups: 2,
      duplicateIndices: [
        [1, 2],
        [3, 4],
      ],
      duplicates: 4,
    });
  });

  it("returns no groups for unique invoices", () => {
    expect(
      findSameDayDuplicateInvoices({
        invoices: [{ amount: 1, date: "2026-01-01", vendor: "Solo" }],
      }),
    ).toEqual({ duplicateGroups: 0, duplicateIndices: [], duplicates: 0 });
  });

  it("rejects a non-array invoices value", () => {
    expect(
      runSameDayDuplicateInvoice({
        invoices: { amount: 1, date: "2026-01-01", vendor: "A" },
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invoices_required", field: "invoices" }] },
      ok: false,
    });
  });

  it("rejects a malformed calendar date with a stable code", () => {
    expect(
      runSameDayDuplicateInvoice({
        invoices: [{ amount: 5, date: "2025-02-30", vendor: "A" }],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_invoice_date", field: "invoices.0.date" }],
      },
      ok: false,
    });
  });

  it("rejects a non-finite amount", () => {
    expect(
      runSameDayDuplicateInvoice({
        invoices: [
          { amount: Number.POSITIVE_INFINITY, date: "2026-01-01", vendor: "A" },
        ],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_invoice_amount", field: "invoices.0.amount" },
        ],
      },
      ok: false,
    });
  });

  it("rejects a blank vendor name", () => {
    expect(
      runSameDayDuplicateInvoice({
        invoices: [{ amount: 5, date: "2026-01-01", vendor: "   " }],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_invoice_vendor", field: "invoices.0.vendor" },
        ],
      },
      ok: false,
    });
  });

  it("treats positive and negative zero as the same exact amount", () => {
    expect(
      findSameDayDuplicateInvoices({
        invoices: [
          { amount: -0, date: "2026-01-01", vendor: "A" },
          { amount: 0, date: "2026-01-01", vendor: "a" },
        ],
      }),
    ).toEqual({
      duplicateGroups: 1,
      duplicateIndices: [[0, 1]],
      duplicates: 2,
    });
  });
});
