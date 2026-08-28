import { describe, expect, it } from "vitest";
import { runMolarVolumeStp } from "./tool.js";
describe("Molar Volume STP Check", () => {
  it("calculates a valid result", () =>
    expect(runMolarVolumeStp({ measuredMolarVolumeML: 22400 })).toEqual({
      ok: true,
      output: {
        deviationPercent: 0.062325171746867934,
        stpMolarVolumeML: 22413.96954501422,
      },
    }));
  it("rejects invalid input", () =>
    expect(runMolarVolumeStp({ measuredMolarVolumeML: -1 }).ok).toBe(false));
});
