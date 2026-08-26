import { describe, expect, it } from "vitest";
import {
  runWeatheringDegreeSimplifiedRater,
  weatheringDegreeSimplifiedRaterExample,
} from "./tool.js";

describe("weathering-degree-simplified-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWeatheringDegreeSimplifiedRater(
        weatheringDegreeSimplifiedRaterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: weatheringDegreeSimplifiedRaterExample.output,
    });
  });

  it("labels the scale endpoints", () => {
    const none = runWeatheringDegreeSimplifiedRater({ degree: 0 });
    if (!none.ok) throw new Error("expected success");
    expect(none.output.label as string).toBe("none");
    expect(none.output.severityFraction as number).toBe(0);
    const extreme = runWeatheringDegreeSimplifiedRater({ degree: 5 });
    if (!extreme.ok) throw new Error("expected success");
    expect(extreme.output.label as string).toBe("extreme");
    expect(extreme.output.severityFraction as number).toBe(1);
  });

  it("rejects a degree above the scale", () => {
    expect(runWeatheringDegreeSimplifiedRater({ degree: 6 }).ok).toBe(false);
  });
});
