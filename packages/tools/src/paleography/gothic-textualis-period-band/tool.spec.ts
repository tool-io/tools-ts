import { describe, expect, it } from "vitest";
import {
  gothicTextualisPeriodBandExample,
  runGothicTextualisPeriodBand,
} from "./tool.js";

describe("gothic-textualis-period-band", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGothicTextualisPeriodBand(gothicTextualisPeriodBandExample.input),
    ).toEqual({ ok: true, output: gothicTextualisPeriodBandExample.output });
  });

  it("places the mid-fifteenth century in the late band", () => {
    const result = runGothicTextualisPeriodBand({ year: 1450 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.periodBand as string).toBe("late_textualis");
    expect(result.output.bandBounds as string).toBe("1400-1499");
  });

  it("rejects years before the documented range", () => {
    expect(runGothicTextualisPeriodBand({ year: 699 }).ok).toBe(false);
    expect(runGothicTextualisPeriodBand({ year: 1601 }).ok).toBe(false);
  });
});
