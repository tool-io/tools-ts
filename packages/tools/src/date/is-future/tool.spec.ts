import { describe, expect, it } from "vitest";
import { isFutureExample, runIsFuture } from "./tool.js";

describe("Is Future Checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsFuture(isFutureExample.input)).toEqual({
      ok: true,
      output: isFutureExample.output,
    });
  });

  it("treats the whole reference UTC day as not future", () => {
    expect(
      runIsFuture({
        value: "2026-08-25T23:59:59Z",
        reference: "2026-08-25T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isFuture: false } });
    expect(
      runIsFuture({
        value: "2026-08-25",
        reference: "2026-08-25T00:00:00.001Z",
      }),
    ).toEqual({ ok: true, output: { isFuture: false } });
  });

  it("marks the next day as future at the UTC boundary", () => {
    expect(
      runIsFuture({
        value: "2026-08-26T00:00:00Z",
        reference: "2026-08-25T23:59:59Z",
      }),
    ).toEqual({ ok: true, output: { isFuture: true } });
    expect(
      runIsFuture({
        value: "2026-08-25T00:00:01Z",
        reference: "2026-08-26T00:00:00Z",
      }),
    ).toEqual({ ok: true, output: { isFuture: false } });
  });

  it("compares plain dates by calendar day", () => {
    expect(
      runIsFuture({ value: "2030-06-30", reference: "2026-08-25" }),
    ).toEqual({ ok: true, output: { isFuture: true } });
    expect(
      runIsFuture({ value: "1999-12-31", reference: "2026-08-25" }),
    ).toEqual({ ok: true, output: { isFuture: false } });
  });

  it("applies UTC offsets before comparing days", () => {
    expect(
      runIsFuture({
        value: "2026-08-25T23:30:00-02:00",
        reference: "2026-08-25",
      }),
    ).toEqual({ ok: true, output: { isFuture: true } });
    expect(
      runIsFuture({
        value: "2026-08-26T00:30:00+02:00",
        reference: "2026-08-26",
      }),
    ).toEqual({ ok: true, output: { isFuture: false } });
  });

  it("uses the injected context clock when reference is omitted", () => {
    let calls = 0;
    const now = () => {
      calls += 1;
      return Date.UTC(2026, 7, 25, 12, 0, 0);
    };
    expect(runIsFuture({ value: "2026-08-26" }, { now })).toEqual({
      ok: true,
      output: { isFuture: true },
    });
    expect(runIsFuture({ value: "2026-08-25T18:00:00Z" }, { now })).toEqual({
      ok: true,
      output: { isFuture: false },
    });
    expect(calls).toBe(2);
  });

  it("prefers an explicit reference over the context clock", () => {
    expect(
      runIsFuture(
        { value: "2026-08-25", reference: "2030-01-01T00:00:00Z" },
        { now: () => Date.UTC(2000, 0, 1) },
      ),
    ).toEqual({ ok: true, output: { isFuture: false } });
  });

  it("requires a reference when none exists", () => {
    expect(runIsFuture({ value: "2026-08-25" })).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
    expect(runIsFuture({ value: "2026-08-25" }, {})).toMatchObject({
      error: { issues: [{ code: "reference_required", field: "reference" }] },
      ok: false,
    });
  });

  it("rejects malformed date-time strings", () => {
    expect(
      runIsFuture({ value: "tomorrow", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
    expect(
      runIsFuture({
        value: "2026-08-25",
        reference: "2026-08-25T12:00:00+24:00",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "reference" }] },
      ok: false,
    });
  });

  it("accepts leap days and rejects impossible calendar dates", () => {
    expect(
      runIsFuture({ value: "2028-02-29", reference: "2026-08-25" }),
    ).toEqual({ ok: true, output: { isFuture: true } });
    expect(
      runIsFuture({ value: "2024-02-30", reference: "2026-08-25" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_datetime", field: "value" }] },
      ok: false,
    });
  });

  it("rejects non-object and unknown-field input", () => {
    expect(runIsFuture(null).ok).toBe(false);
    expect(runIsFuture({ value: "2026-08-25", extra: 1 }).ok).toBe(false);
  });
});
