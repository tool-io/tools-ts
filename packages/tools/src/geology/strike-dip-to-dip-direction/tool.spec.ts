import { describe, expect, it } from "vitest";
import {
  strikeDipToDipDirectionExample,
  runStrikeDipToDipDirection,
} from "./tool.js";

describe("strike-dip-to-dip-direction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStrikeDipToDipDirection(strikeDipToDipDirectionExample.input),
    ).toEqual({
      ok: true,
      output: strikeDipToDipDirectionExample.output,
    });
  });

  it("wraps azimuths past north", () => {
    const result = runStrikeDipToDipDirection({ strikeDeg: 350 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dipDirectionDeg as number).toBe(80);
  });

  it("rejects strikes outside the compass range", () => {
    expect(runStrikeDipToDipDirection({ strikeDeg: 360 }).ok).toBe(false);
    expect(runStrikeDipToDipDirection({ strikeDeg: -10 }).ok).toBe(false);
  });
});
