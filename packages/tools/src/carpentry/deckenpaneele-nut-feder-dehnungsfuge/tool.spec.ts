import { describe, expect, it } from "vitest";
import {
  ceilingPanelExpansionGapExample,
  ceilingPanelExpansionGapTool,
  runCeilingPanelExpansionGap,
} from "./tool.js";

describe("Ceiling Panel Expansion Gap Rule", () => {
  it("computes the canonical example", () =>
    expect(
      runCeilingPanelExpansionGap(ceilingPanelExpansionGapExample.input),
    ).toEqual({
      ok: true,
      output: { expansionGapMm: 8 },
    }));

  it("recommends 5 mm below 4 m", () =>
    expect(runCeilingPanelExpansionGap({ panelFieldLengthM: 3.99 })).toEqual({
      ok: true,
      output: { expansionGapMm: 5 },
    }));

  it("recommends 8 mm from exactly 4 m", () =>
    expect(runCeilingPanelExpansionGap({ panelFieldLengthM: 4 })).toEqual({
      ok: true,
      output: { expansionGapMm: 8 },
    }));

  it.each([0.5, 2, 3])("keeps 5 mm for %p m fields", (panelFieldLengthM) =>
    expect(runCeilingPanelExpansionGap({ panelFieldLengthM })).toEqual({
      ok: true,
      output: { expansionGapMm: 5 },
    }),
  );

  it.each([6, 10, 15])("keeps 8 mm for %p m fields", (panelFieldLengthM) =>
    expect(runCeilingPanelExpansionGap({ panelFieldLengthM })).toEqual({
      ok: true,
      output: { expansionGapMm: 8 },
    }),
  );

  it("accepts the maximum field length of 15 m", () =>
    expect(runCeilingPanelExpansionGap({ panelFieldLengthM: 15 }).ok).toBe(
      true,
    ));

  it("rejects field lengths above 15 m", () => {
    const result = runCeilingPanelExpansionGap({ panelFieldLengthM: 15.01 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-positive field lengths", () => {
    const zero = runCeilingPanelExpansionGap({ panelFieldLengthM: 0 });
    const negative = runCeilingPanelExpansionGap({ panelFieldLengthM: -6 });
    expect(zero.ok).toBe(false);
    expect(negative.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects non-finite field lengths", () => {
    expect(
      runCeilingPanelExpansionGap({ panelFieldLengthM: Number.NaN }).ok,
    ).toBe(false);
    expect(
      runCeilingPanelExpansionGap({
        panelFieldLengthM: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects a missing field length", () =>
    expect(runCeilingPanelExpansionGap({}).ok).toBe(false));

  it("rejects non-numeric field lengths", () =>
    expect(
      runCeilingPanelExpansionGap({ panelFieldLengthM: "6" } as never).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runCeilingPanelExpansionGap({
      panelWidthMm: 200,
      panelFieldLengthM: 6,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(ceilingPanelExpansionGapExample))).toEqual(
      ceilingPanelExpansionGapExample,
    );
    expect(ceilingPanelExpansionGapTool.id).toBe(
      "carpentry/deckenpaneele-nut-feder-dehnungsfuge",
    );
    expect(ceilingPanelExpansionGapTool.execution).toEqual({ kind: "pure" });
    expect(ceilingPanelExpansionGapTool.outputSchema.required).toEqual([
      "expansionGapMm",
    ]);
  });
});
