import { describe, expect, it } from "vitest";
import {
  dipDirectionToStrikeExample,
  runDipDirectionToStrike,
} from "./tool.js";

describe("dip-direction-to-strike", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDipDirectionToStrike(dipDirectionToStrikeExample.input)).toEqual({
      ok: true,
      output: dipDirectionToStrikeExample.output,
    });
  });

  it("wraps strikes below north", () => {
    const result = runDipDirectionToStrike({ dipDirectionDeg: 45 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.strikeDeg as number).toBe(315);
  });

  it("rejects azimuths outside the compass range", () => {
    expect(runDipDirectionToStrike({ dipDirectionDeg: 360 }).ok).toBe(false);
    expect(runDipDirectionToStrike({ dipDirectionDeg: -1 }).ok).toBe(false);
  });
});
