import { describe, expect, it } from "vitest";
import {
  cannonPinionForceExample,
  runCannonPinionForce,
  screenCannonPinionSettingForce,
} from "./tool.js";

describe("cannon-pinion setting-force threshold screen", () => {
  it("reproduces the canonical force-window example", () => {
    expect(runCannonPinionForce(cannonPinionForceExample.input)).toEqual({
      ok: true,
      output: cannonPinionForceExample.output,
    });
  });

  it("accepts a force exactly at the caller minimum", () => {
    expect(
      screenCannonPinionSettingForce({
        measuredPullForceNewtons: 5,
        minimumAllowedPullForceNewtons: 5,
        maximumAllowedPullForceNewtons: 10,
      }).withinCallerForceWindow,
    ).toBe(true);
  });

  it("rejects a force above the caller maximum", () => {
    expect(
      screenCannonPinionSettingForce({
        measuredPullForceNewtons: 10.1,
        minimumAllowedPullForceNewtons: 5,
        maximumAllowedPullForceNewtons: 10,
      }).withinCallerForceWindow,
    ).toBe(false);
  });

  it("rejects a reversed force window", () => {
    expect(
      runCannonPinionForce({
        measuredPullForceNewtons: 8,
        minimumAllowedPullForceNewtons: 12,
        maximumAllowedPullForceNewtons: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "force_window_reversed", field: "" }] },
      ok: false,
    });
  });

  it("rejects a negative measured force", () => {
    expect(
      runCannonPinionForce({
        measuredPullForceNewtons: -1,
        minimumAllowedPullForceNewtons: 5,
        maximumAllowedPullForceNewtons: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "measuredPullForceNewtons" }],
      },
      ok: false,
    });
  });
});
