import { describe, expect, it } from "vitest";
import { calculateEsrFromQ, esrFromQExample, runEsrFromQ } from "./tool.js";

describe("ESR From Q", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEsrFromQ(esrFromQExample.input)).toEqual({
      ok: true,
      output: esrFromQExample.output,
    });
  });

  it("halves ESR when quality factor doubles", () => {
    const base = calculateEsrFromQ({
      qFactor: 40,
      reactanceOhms: 80,
    }).esrOhms;
    expect(calculateEsrFromQ({ qFactor: 80, reactanceOhms: 80 }).esrOhms).toBe(
      base / 2,
    );
  });

  it("returns zero ESR for a lossless component", () => {
    expect(calculateEsrFromQ({ qFactor: 25, reactanceOhms: 0 }).esrOhms).toBe(
      0,
    );
  });

  it("is the reciprocal mapping of Q from ESR", () => {
    const esr = calculateEsrFromQ({
      qFactor: 12.5,
      reactanceOhms: 250,
    }).esrOhms;
    expect(esr).toBe(20);
  });

  it("rejects zero quality factor with a stable code", () => {
    expect(runEsrFromQ({ qFactor: 0, reactanceOhms: 50 })).toMatchObject({
      error: { issues: [{ code: "invalid_q", field: "qFactor" }] },
      ok: false,
    });
  });

  it("rejects negative reactance with a stable code", () => {
    expect(runEsrFromQ({ qFactor: 5, reactanceOhms: -10 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_reactance", field: "reactanceOhms" }],
      },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runEsrFromQ({ ...esrFromQExample.input, ohms: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "ohms" }] },
      ok: false,
    });
  });
});
