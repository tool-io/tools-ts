import { describe, expect, it } from "vitest";
import {
  runSawBladeOverstand,
  sawBladeOverstandExample,
  sawBladeOverstandTool,
} from "./tool.js";

describe("Saw Blade Overstand Calculator", () => {
  it("computes the canonical example", () =>
    expect(runSawBladeOverstand(sawBladeOverstandExample.input)).toEqual({
      ok: true,
      output: { minimumBladeOverstandMm: 24 },
    }));

  it.each([
    [12, 17],
    [38, 43],
    [120, 125],
    [0.5, 5.5],
    [0.25, 5.25],
  ])("adds the 5 mm shop rule to %p mm board", (thickness, expected) =>
    expect(runSawBladeOverstand({ boardThicknessMm: thickness })).toEqual({
      ok: true,
      output: { minimumBladeOverstandMm: expected },
    }),
  );

  it("rejects non-positive board thickness", () => {
    const zero = runSawBladeOverstand({ boardThicknessMm: 0 });
    const negative = runSawBladeOverstand({ boardThicknessMm: -19 });
    expect(zero.ok).toBe(false);
    expect(negative.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
    if (!negative.ok)
      expect(negative.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("returns a stable structured error for zero thickness", () =>
    expect(runSawBladeOverstand({ boardThicknessMm: 0 })).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "must_be_positive",
            field: "boardThicknessMm",
            message: "Board thickness must be positive.",
          },
        ],
      },
    }));

  it("rejects a missing board thickness", () => {
    const result = runSawBladeOverstand({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "boardThicknessMm",
        message: "Board thickness is invalid.",
      });
  });

  it("rejects non-finite board thickness", () => {
    expect(runSawBladeOverstand({ boardThicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runSawBladeOverstand({ boardThicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
    expect(
      runSawBladeOverstand({ boardThicknessMm: Number.NEGATIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric board thickness", () =>
    expect(runSawBladeOverstand({ boardThicknessMm: "19" } as never).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () => {
    const result = runSawBladeOverstand({
      boardThicknessMm: 19,
      kerf: 3,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "unknown_field",
        field: "kerf",
        message: "kerf is not a supported input field.",
      });
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(sawBladeOverstandExample))).toEqual(
      sawBladeOverstandExample,
    );
    expect(sawBladeOverstandTool.id).toBe(
      "carpentry/kreissaege-blatt-ueberstand-5mm",
    );
    expect(sawBladeOverstandTool.execution).toEqual({ kind: "pure" });
    expect(sawBladeOverstandTool.outputSchema.required).toEqual([
      "minimumBladeOverstandMm",
    ]);
  });
});
