import { describe, expect, it } from "vitest";
import {
  calculateTrailerDwellTimeHoursChecker,
  trailerDwellTimeHoursCheckerExample,
  runTrailerDwellTimeHoursChecker,
} from "./tool.js";

describe("trailer-dwell-time-hours-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTrailerDwellTimeHoursChecker(
        trailerDwellTimeHoursCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: trailerDwellTimeHoursCheckerExample.output,
    });
  });

  it("applies the default two hour free time", () => {
    expect(runTrailerDwellTimeHoursChecker({ dwellHours: 1.5 })).toEqual({
      ok: true,
      output: { excessHours: 0, withinFreeTime: true },
    });
  });

  it("allows a zero-hour free-time policy", () => {
    expect(
      runTrailerDwellTimeHoursChecker({
        dwellHours: 3,
        freeTimeHours: 0,
      }),
    ).toEqual({
      ok: true,
      output: { excessHours: 3, withinFreeTime: false },
    });
  });

  it("rejects non-finite dwell time", () => {
    expect(() =>
      calculateTrailerDwellTimeHoursChecker({
        dwellHours: Number.NaN,
      }),
    ).toThrow("must be finite");
  });
});
