import { describe, expect, it } from "vitest";
import { calculateQFromEsr, qFromEsrExample, runQFromEsr } from "./tool.js";

describe("Q From ESR", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQFromEsr(qFromEsrExample.input)).toEqual({
      ok: true,
      output: qFromEsrExample.output,
    });
  });

  it("doubles Q when ESR halves", () => {
    const base = calculateQFromEsr({
      esrOhms: 8,
      reactanceOhms: 96,
    }).qFactor;
    expect(calculateQFromEsr({ esrOhms: 4, reactanceOhms: 96 }).qFactor).toBe(
      base * 2,
    );
  });

  it("returns zero Q for a purely resistive part", () => {
    expect(calculateQFromEsr({ esrOhms: 15, reactanceOhms: 0 }).qFactor).toBe(
      0,
    );
  });

  it("inverts ESR from Q exactly", () => {
    expect(
      calculateQFromEsr({ esrOhms: 0.5, reactanceOhms: 125 }).qFactor,
    ).toBe(250);
  });

  it("rejects zero ESR with a stable code", () => {
    expect(runQFromEsr({ esrOhms: 0, reactanceOhms: 60 })).toMatchObject({
      error: { issues: [{ code: "invalid_esr", field: "esrOhms" }] },
      ok: false,
    });
  });

  it("rejects negative reactance with a stable code", () => {
    expect(runQFromEsr({ esrOhms: 2, reactanceOhms: -60 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_reactance", field: "reactanceOhms" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runQFromEsr({ reactanceOhms: 60 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "esrOhms" }] },
      ok: false,
    });
  });
});
