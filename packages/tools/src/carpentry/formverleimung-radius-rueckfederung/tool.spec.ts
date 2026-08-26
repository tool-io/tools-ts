import { describe, expect, it } from "vitest";
import {
  formBendingSpringbackExample,
  formBendingSpringbackTool,
  runFormBendingSpringback,
} from "./tool.js";

describe("Form Bending Springback Calculator", () => {
  it("computes the canonical example", () =>
    expect(
      runFormBendingSpringback(formBendingSpringbackExample.input),
    ).toEqual({
      ok: true,
      output: { actualRadiusMm: 750 },
    }));

  it("applies the default 8 percent springback when omitted", () =>
    expect(runFormBendingSpringback({ formRadiusMm: 500 })).toEqual({
      ok: true,
      output: { actualRadiusMm: 540 },
    }));

  it("scales the default springback with the form radius", () =>
    expect(runFormBendingSpringback({ formRadiusMm: 200 })).toEqual({
      ok: true,
      output: { actualRadiusMm: 216 },
    }));

  it("treats an explicit default like an omitted springback", () => {
    const omitted = runFormBendingSpringback({ formRadiusMm: 200 });
    const explicit = runFormBendingSpringback({
      formRadiusMm: 200,
      springbackPercent: 8,
    });
    expect(explicit).toEqual(omitted);
  });

  it("returns the form radius unchanged at zero springback", () =>
    expect(
      runFormBendingSpringback({ formRadiusMm: 300, springbackPercent: 0 }),
    ).toEqual({
      ok: true,
      output: { actualRadiusMm: 300 },
    }));

  it("supports the maximum springback of 30 percent", () =>
    expect(
      runFormBendingSpringback({ formRadiusMm: 400, springbackPercent: 30 }),
    ).toEqual({
      ok: true,
      output: { actualRadiusMm: 520 },
    }));

  it("rejects non-positive form radii", () => {
    const zero = runFormBendingSpringback({
      formRadiusMm: 0,
      springbackPercent: 8,
    });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "formRadiusMm",
        message: "Form radius must be positive.",
      });
    expect(runFormBendingSpringback({ formRadiusMm: -600 }).ok).toBe(false);
  });

  it("rejects springback outside 0 to 30 percent", () => {
    const above = runFormBendingSpringback({
      formRadiusMm: 100,
      springbackPercent: 31,
    });
    expect(above.ok).toBe(false);
    if (!above.ok)
      expect(above.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "springbackPercent",
        message: "Springback is invalid.",
      });
    expect(
      runFormBendingSpringback({ formRadiusMm: 100, springbackPercent: -5 }).ok,
    ).toBe(false);
  });

  it("rejects a missing and non-finite form radius", () => {
    expect(runFormBendingSpringback({}).ok).toBe(false);
    expect(runFormBendingSpringback({ formRadiusMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runFormBendingSpringback({
        formRadiusMm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric and unknown inputs", () => {
    expect(runFormBendingSpringback({ formRadiusMm: "600" } as never).ok).toBe(
      false,
    );
    const extra = runFormBendingSpringback({
      formRadiusMm: 600,
      layers: 3,
    } as never);
    expect(extra.ok).toBe(false);
    if (!extra.ok) expect(extra.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(formBendingSpringbackExample))).toEqual(
      formBendingSpringbackExample,
    );
    expect(formBendingSpringbackTool.id).toBe(
      "carpentry/formverleimung-radius-rueckfederung",
    );
    expect(formBendingSpringbackTool.execution).toEqual({ kind: "pure" });
    expect(
      formBendingSpringbackTool.inputSchema.properties?.springbackPercent,
    ).toMatchObject({ default: 8 });
  });
});
