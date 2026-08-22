import { describe, expect, it } from "vitest";
import { isPastExample, runIsPast } from "./tool.js";

describe("Is Past Checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsPast(isPastExample.input)).toEqual({
      ok: true,
      output: isPastExample.output,
    });
  });

  it("treats the whole reference UTC day as not past", () => {
    expect(
      runIsPast({
        value: "2026-08-25T00:00:00Z",
        reference: "2026-08-25T23:59:59Z",
      }),
    ).toEqual({ ok: true, output: { isPast: false } });
    expect(
      runIsPast({
        value: "2026-08-25",
        reference: "2026-08-25T23:59:59.999Z",
      }),
    ).toEqual({ ok: true, output: { isPast: false } });
  });

  it("marks the previous day as past at the UTC boundary", () => {
    expect(
      runIsPast({
        value: "2026-08-24T23:59:59Z",
        reference: "2026-08-25T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isPast: true } });
    expect(
      runIsPast({
        value: "2026-08-25T23:59:59Z",
        reference: "2026-08-26T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isPast: true } });
  });

  it("compares plain dates by calendar day", () => {
    expect(runIsPast({ value: "2024-02-29", reference: "2026-08-25" })).toEqual(
      { ok: true, output: { isPast: true } },
    );
    expect(runIsPast({ value: "2027-01-01", reference: "2026-08-25" })).toEqual(
      { ok: true, output: { isPast: false } },
    );
  });

  it("applies UTC offsets before comparing days", () => {
    expect(
      runIsPast({
        value: "2026-08-26T00:30:00+02:00",
        reference: "2026-08-26",
      }),
    ).toEqual({ ok: true, output: { isPast: true } });
    expect(
      runIsPast({
        value: "2026-08-25T23:30:00-02:00",
        reference: "2026-08-26",
      }),
    ).toEqual({ ok: true, output: { isPast: false } });
  });

  it("uses the injected context clock when reference is omitted", () => {
    let calls = 0;
    const now = () => {
      calls += 1;
      return Date.UTC(2026, 7, 25, 12, 0, 0);
    };
    expect(runIsPast({ value: "2026-08-24" }, { now })).toEqual({
      ok: true,
      output: { isPast: true },
    });
    expect(runIsPast({ value: "2026-08-25T09:00:00Z" }, { now })).toEqual({
      ok: true,
      output: { isPast: false },
    });
    expect(calls).toBe(2);
  });

  it("prefers an explicit reference over the context clock", () => {
    expect(
      runIsPast(
        { value: "2026-08-25", reference: "2025-01-01T00:00:00Z" },
        { now: () => Date.UTC(2030, 0, 1) },
      ),
    ).toEqual({ ok: true, output: { isPast: false } });
  });

  it("requires a reference when none exists", () => {
    expect(runIsPast({ value: "2026-08-25" })).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
    expect(runIsPast({ value: "2026-08-25" }, {})).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects malformed date-time strings", () => {
    expect(
      runIsPast({ value: "yesterday", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsPast({ value: "2026-08-25", reference: "2026-08-25T12:60:00Z" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects impossible calendar dates", () => {
    expect(
      runIsPast({ value: "2023-02-29", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsPast({ value: "2026-04-31", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
  });

  it("rejects non-object and unknown-field input", () => {
    expect(runIsPast(null).ok).toBe(false);
    expect(runIsPast({ value: "2026-08-25", extra: 1 }).ok).toBe(false);
  });
});
