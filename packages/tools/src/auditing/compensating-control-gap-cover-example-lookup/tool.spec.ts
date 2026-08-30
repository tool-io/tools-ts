import { describe, expect, it } from "vitest";
import {
  assessCompensatingControlCoverage,
  compensatingControlExample,
  runCompensatingControl,
} from "./tool.js";

describe("compensating control gap coverage", () => {
  it("reproduces its canonical example", () => {
    expect(runCompensatingControl(compensatingControlExample.input)).toEqual({
      ok: true,
      output: compensatingControlExample.output,
    });
  });

  it("reports full coverage only when controls operated effectively", () => {
    expect(
      assessCompensatingControlCoverage({
        compensatingControls: ["Review"],
        coversGap: true,
        gapDescription: "Access conflict",
        operatedEffectively: true,
      }).status,
    ).toBe("covered");
  });

  it("reports an uncovered gap without compensating controls", () => {
    expect(
      assessCompensatingControlCoverage({
        compensatingControls: [],
        coversGap: false,
        gapDescription: "Access conflict",
        operatedEffectively: false,
      }).status,
    ).toBe("uncovered");
  });

  it("rejects a blank gap description", () => {
    expect(
      runCompensatingControl({
        compensatingControls: [],
        coversGap: false,
        gapDescription: " ",
        operatedEffectively: false,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "gap_description_required", field: "gapDescription" }],
      },
      ok: false,
    });
  });
});
