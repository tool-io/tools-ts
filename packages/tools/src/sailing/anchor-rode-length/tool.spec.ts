import { describe, expect, it } from "vitest";
import { anchorRodeLengthExample, runAnchorRodeLength } from "./tool.js";

describe("anchor rode length calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAnchorRodeLength(anchorRodeLengthExample.input)).toEqual({
      ok: true,
      output: anchorRodeLengthExample.output,
    });
  });

  it("uses default scope of seven and freeboard of four", () => {
    expect(runAnchorRodeLength({ depthFt: 10 })).toEqual({
      ok: true,
      output: { rodeLengthFt: 98 },
    });
  });
});
