import { describe, expect, it } from "vitest";
import {
  latticeConstantVegardExample,
  runLatticeConstantVegard,
} from "./tool.js";

describe("Vegard Law Lattice Constant Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runLatticeConstantVegard(latticeConstantVegardExample.input),
    ).toEqual({ ok: true, output: latticeConstantVegardExample.output }));

  it("returns pure compound A at x = 0", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        moleFractionX: 0,
      }),
    ).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.6533 },
    }));

  it("returns pure compound B at x = 1", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        moleFractionX: 1,
      }),
    ).toEqual({
      ok: true,
      output: { latticeConstantAngstrom: 5.6611 },
    }));

  it("averages both compounds at the midpoint", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        moleFractionX: 0.5,
      }),
    ).toEqual({ ok: true, output: { latticeConstantAngstrom: 5.6572 } }));

  it("increases monotonically with the mole fraction", () => {
    const low = runLatticeConstantVegard({
      ...latticeConstantVegardExample.input,
      moleFractionX: 0.2,
    });
    const high = runLatticeConstantVegard({
      ...latticeConstantVegardExample.input,
      moleFractionX: 0.8,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.latticeConstantAngstrom as number).toBeGreaterThan(
      low.output.latticeConstantAngstrom as number,
    );
  });

  it("rejects mole fractions above one through the schema maximum", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        moleFractionX: 1.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "moleFractionX" }] },
      ok: false,
    }));

  it("rejects negative mole fractions through the schema minimum", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        moleFractionX: -0.1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "moleFractionX" }] },
      ok: false,
    }));

  it("rejects non-positive compound A with a stable code", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        compoundALatticeAngstrom: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "compoundALatticeAngstrom",
          },
        ],
      },
      ok: false,
    }));

  it("rejects non-positive compound B with a stable code", () =>
    expect(
      runLatticeConstantVegard({
        ...latticeConstantVegardExample.input,
        compoundBLatticeAngstrom: -5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "compoundBLatticeAngstrom",
          },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runLatticeConstantVegard({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "moleFractionX" }] },
      ok: false,
    }));
});
