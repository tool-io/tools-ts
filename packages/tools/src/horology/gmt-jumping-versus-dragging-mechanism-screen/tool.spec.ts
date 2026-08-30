import { describe, expect, it } from "vitest";
import {
  gmtMechanismScreenExample,
  runGmtMechanismScreen,
  screenGmtJumpingVersusDraggingMechanism,
} from "./tool.js";

describe("GMT jumping-versus-dragging mechanism screen", () => {
  it("reproduces the canonical jumping-hour example", () => {
    expect(runGmtMechanismScreen(gmtMechanismScreenExample.input)).toEqual({
      ok: true,
      output: gmtMechanismScreenExample.output,
    });
  });

  it("recognizes independent hour dragging", () => {
    expect(
      screenGmtJumpingVersusDraggingMechanism({
        hourHandMovesContinuously: true,
        hourHandSteps: false,
        independentHourSetting: true,
      }).classification,
    ).toBe("dragging");
  });

  it("recognizes a continuous hour hand", () => {
    expect(
      screenGmtJumpingVersusDraggingMechanism({
        hourHandMovesContinuously: true,
        hourHandSteps: false,
        independentHourSetting: false,
      }).classification,
    ).toBe("continuous");
  });

  it("does not guess when no distinguishing feature is supplied", () => {
    expect(
      screenGmtJumpingVersusDraggingMechanism({
        hourHandMovesContinuously: false,
        hourHandSteps: false,
        independentHourSetting: false,
      }).classification,
    ).toBe("ambiguous");
  });

  it("rejects contradictory continuous and stepped behavior", () => {
    expect(
      runGmtMechanismScreen({
        hourHandMovesContinuously: true,
        hourHandSteps: true,
        independentHourSetting: false,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "contradictory_hour_hand_behavior",
            field: "hourHandSteps",
          },
        ],
      },
      ok: false,
    });
  });
});
