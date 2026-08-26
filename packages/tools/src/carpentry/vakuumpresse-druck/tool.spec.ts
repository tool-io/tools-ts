import { describe, expect, it } from "vitest";
import {
  runVacuumPressPressure,
  vacuumPressPressureExample,
  vacuumPressPressureTool,
} from "./tool.js";

describe("Vacuum Press Pressure Calculator", () => {
  it("computes the canonical example", () =>
    expect(runVacuumPressPressure(vacuumPressPressureExample.input)).toEqual({
      ok: true,
      output: { absolutePressureBar: 0.5 },
    }));

  it.each([
    [25, 0.75],
    [62.5, 0.375],
    [80, 0.19999999999999996],
    [33, 0.6699999999999999],
  ])("reduces atmospheric pressure by %p percent", (vacuumPercent, expected) =>
    expect(runVacuumPressPressure({ vacuumPercent })).toEqual({
      ok: true,
      output: { absolutePressureBar: expected },
    }),
  );

  it("keeps full atmospheric pressure at zero vacuum", () =>
    expect(runVacuumPressPressure({ vacuumPercent: 0 })).toEqual({
      ok: true,
      output: { absolutePressureBar: 1 },
    }));

  it("stays positive at the maximum vacuum of 95 percent", () =>
    expect(runVacuumPressPressure({ vacuumPercent: 95 })).toEqual({
      ok: true,
      output: { absolutePressureBar: 0.050000000000000044 },
    }));

  it("decreases monotonically with the vacuum percentage", () => {
    const low = runVacuumPressPressure({ vacuumPercent: 20 });
    const high = runVacuumPressPressure({ vacuumPercent: 70 });
    expect(low.ok && high.ok).toBe(true);
    if (low.ok && high.ok)
      expect(
        (low.output as { absolutePressureBar: number }).absolutePressureBar,
      ).toBeGreaterThan(
        (high.output as { absolutePressureBar: number }).absolutePressureBar,
      );
  });

  it("rejects vacuum above 95 percent", () =>
    expect(runVacuumPressPressure({ vacuumPercent: 96 })).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "invalid_field",
            field: "vacuumPercent",
            message: "Vacuum is invalid.",
          },
        ],
      },
    }));

  it("rejects negative vacuum", () => {
    const result = runVacuumPressPressure({ vacuumPercent: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects missing and non-finite vacuum", () => {
    expect(runVacuumPressPressure({}).ok).toBe(false);
    expect(runVacuumPressPressure({ vacuumPercent: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runVacuumPressPressure({
        vacuumPercent: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric and unknown inputs", () => {
    expect(runVacuumPressPressure({ vacuumPercent: "50" } as never).ok).toBe(
      false,
    );
    const extra = runVacuumPressPressure({
      vacuumPercent: 50,
      pumpStage: 2,
    } as never);
    expect(extra.ok).toBe(false);
    if (!extra.ok)
      expect(extra.error.issues[0]).toEqual({
        code: "unknown_field",
        field: "pumpStage",
        message: "pumpStage is not a supported input field.",
      });
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(vacuumPressPressureExample))).toEqual(
      vacuumPressPressureExample,
    );
    expect(vacuumPressPressureTool.id).toBe("carpentry/vakuumpresse-druck");
    expect(vacuumPressPressureTool.execution).toEqual({ kind: "pure" });
    expect(
      vacuumPressPressureTool.inputSchema.properties?.vacuumPercent,
    ).toMatchObject({ minimum: 0, maximum: 95 });
  });
});
