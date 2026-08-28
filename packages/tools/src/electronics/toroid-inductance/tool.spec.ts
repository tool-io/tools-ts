import { describe, expect, it } from "vitest";
import { runToroidInductance, toroidInductanceExample } from "./tool.js";

describe("Toroid Inductance", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runToroidInductance(toroidInductanceExample.input)).toEqual({
      ok: true,
      output: toroidInductanceExample.output,
    }));

  it("defaults the AL value to 1000 nH per turn squared", () =>
    expect(runToroidInductance({ turnsInt: 10 })).toEqual({
      ok: true,
      output: { inductanceUh: 100 },
    }));

  it("scales with the square of the turns count", () =>
    expect(runToroidInductance({ alNhPerTurnSq: 250, turnsInt: 25 })).toEqual({
      ok: true,
      output: { inductanceUh: 156.25 },
    }));

  it("doubles the inductance when AL doubles at fixed turns", () => {
    const base = runToroidInductance({ alNhPerTurnSq: 400, turnsInt: 12 });
    const doubled = runToroidInductance({ alNhPerTurnSq: 800, turnsInt: 12 });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(base.output.inductanceUh).toBeCloseTo(57.6, 12);
    expect(doubled.output.inductanceUh).toBeCloseTo(115.2, 12);
  });

  it("rejects a non-positive AL value", () =>
    expect(
      runToroidInductance({ alNhPerTurnSq: 0, turnsInt: 10 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_al", field: "alNhPerTurnSq" }] },
      ok: false,
    }));

  it("rejects non-integer turns counts", () =>
    expect(
      runToroidInductance({ alNhPerTurnSq: 1000, turnsInt: 2.5 }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_field", field: "turnsInt" }],
      },
      ok: false,
    }));

  it("rejects turns counts below one", () =>
    expect(
      runToroidInductance({ alNhPerTurnSq: 1000, turnsInt: 0 }),
    ).toMatchObject({
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_field", field: "turnsInt" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runToroidInductance(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
