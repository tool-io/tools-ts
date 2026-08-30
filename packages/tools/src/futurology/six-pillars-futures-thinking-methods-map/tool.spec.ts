import { describe, expect, it } from "vitest";
import {
  mapSixPillarsActivities,
  runSixPillarsMap,
  sixPillarsMapExample,
} from "./tool.js";

describe("six pillars futures methods map", () => {
  it("reproduces its canonical example", () => {
    expect(runSixPillarsMap(sixPillarsMapExample.input)).toEqual({
      ok: true,
      output: sixPillarsMapExample.output,
    });
  });

  it("matches pillar labels without case sensitivity", () => {
    expect(
      mapSixPillarsActivities({
        activityMappings: [" VISION : scenario "],
        pillars: ["challenge", "vision", "act", "analyze", "imagine", "sense"],
      }).mappedActivities,
    ).toBe(1);
  });

  it("reports complete coverage", () => {
    expect(
      mapSixPillarsActivities({
        activityMappings: ["a:x", "b:x", "c:x", "d:x", "e:x", "f:x"],
        pillars: ["a", "b", "c", "d", "e", "f"],
      }).completeCoverage,
    ).toBe(true);
  });

  it("rejects a pillar list not containing six entries", () => {
    expect(
      runSixPillarsMap({ activityMappings: [], pillars: ["A"] }),
    ).toMatchObject({
      error: { issues: [{ code: "six_pillars_required", field: "pillars" }] },
      ok: false,
    });
  });
});
