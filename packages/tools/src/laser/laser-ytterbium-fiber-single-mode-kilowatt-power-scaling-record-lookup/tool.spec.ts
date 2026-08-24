import { describe, expect, it } from "vitest";
import {
  runYtterbiumScalingTimeline,
  ytterbiumScalingTimelineExample as example,
} from "./tool.js";
describe("Yb-fiber representative milestone timeline", () => {
  it("returns the latest curated milestone at the year", () =>
    expect(runYtterbiumScalingTimeline(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("marks years before the first entry", () =>
    expect(runYtterbiumScalingTimeline({ year: 1990 })).toMatchObject({
      ok: true,
      output: { beforeFirstDemonstration: true, milestoneYear: 1999 },
    }));
});
