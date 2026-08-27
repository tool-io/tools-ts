import { describe, expect, it } from "vitest";
import { runSchnabel, schnabelExample } from "./tool.js";

describe("Schnabel Estimate", () => {
  it("matches the canonical example", () => {
    expect(runSchnabel(schnabelExample.input)).toEqual({
      ok: true,
      output: schnabelExample.output,
    });
  });

  it("computes an even two session estimate exactly", () => {
    expect(
      runSchnabel({
        caughtSessionOne: 20,
        caughtSessionTwo: 30,
        recapturesTotal: 5,
      }),
    ).toEqual({ ok: true, output: { schnabelEstimate: 120 } });
  });

  it("computes a small population exactly", () => {
    expect(
      runSchnabel({
        caughtSessionOne: 12,
        caughtSessionTwo: 15,
        recapturesTotal: 4,
      }),
    ).toEqual({ ok: true, output: { schnabelEstimate: 45 } });
  });

  it("rejects zero recaptures with a stable code", () => {
    const result = runSchnabel({
      caughtSessionOne: 50,
      caughtSessionTwo: 40,
      recapturesTotal: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "zero_recaptures",
        field: "recapturesTotal",
      });
  });

  it("rejects negative recaptures with a stable code", () => {
    const result = runSchnabel({
      caughtSessionOne: 50,
      caughtSessionTwo: 40,
      recapturesTotal: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_recaptures");
  });

  it("rejects non positive and fractional session counts through the schema", () => {
    expect(
      runSchnabel({
        caughtSessionOne: 0,
        caughtSessionTwo: 40,
        recapturesTotal: 11,
      }).ok,
    ).toBe(false);
    expect(
      runSchnabel({
        caughtSessionOne: 62.5,
        caughtSessionTwo: 37,
        recapturesTotal: 11,
      }).ok,
    ).toBe(false);
    expect(
      runSchnabel({
        caughtSessionOne: 62,
        caughtSessionTwo: 0,
        recapturesTotal: 11,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and missing required input", () => {
    const extra = runSchnabel({
      caughtSessionOne: 62,
      caughtSessionTwo: 37,
      recapturesTotal: 11,
      sessions: 2,
    });
    if (!extra.ok)
      expect(extra.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "sessions",
      });
    expect(runSchnabel({ caughtSessionOne: 62, caughtSessionTwo: 37 }).ok).toBe(
      false,
    );
  });
});
