import { describe, expect, it } from "vitest";
import {
  runwayRequiredTakeoffExample,
  runRunwayRequiredTakeoff,
} from "./tool.js";

describe("runway required takeoff calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRunwayRequiredTakeoff(runwayRequiredTakeoffExample.input),
    ).toEqual({
      ok: true,
      output: runwayRequiredTakeoffExample.output,
    });
  });
  it("rejects non-positive roll through execution", () => {
    expect(
      runRunwayRequiredTakeoff({ groundRollFt: 0, headwindKt: 10 }).ok,
    ).toBe(false);
  });
});
