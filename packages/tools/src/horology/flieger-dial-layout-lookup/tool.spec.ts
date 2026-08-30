import { describe, expect, it } from "vitest";
import {
  fliegerLayoutExample,
  lookupFliegerDialLayout,
  runFliegerLayout,
} from "./tool.js";

describe("Panzer Flieger dial-layout lookup", () => {
  it("reproduces the canonical Type B layout", () => {
    expect(runFliegerLayout(fliegerLayoutExample.input)).toEqual({
      ok: true,
      output: fliegerLayoutExample.output,
    });
  });

  it("places large hours on Type A", () => {
    expect(
      lookupFliegerDialLayout({ dialLayout: "typeA" }).hourLayout,
    ).toContain("large Arabic");
  });

  it("places the prominent minute scale on Type B", () => {
    expect(
      lookupFliegerDialLayout({ dialLayout: "typeB" }).minuteTrack,
    ).toContain("outer minute scale");
  });

  it("retains the Type A triangle-and-dots marker", () => {
    expect(lookupFliegerDialLayout({ dialLayout: "typeA" }).twelveOClock).toBe(
      "triangle with two dots",
    );
  });

  it("rejects an unsupported layout at the public boundary", () => {
    expect(runFliegerLayout({ dialLayout: "typeC" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "dialLayout" }] },
      ok: false,
    });
  });
});
