import { describe, expect, it } from "vitest";
import {
  lookupWinderRotationDirection,
  runWinderDirection,
  winderDirectionExample,
} from "./tool.js";

describe("watch-winder rotation-direction lookup", () => {
  it("reproduces the canonical alternating-setting example", () => {
    expect(runWinderDirection(winderDirectionExample.input)).toEqual({
      ok: true,
      output: winderDirectionExample.output,
    });
  });

  it("describes continuous clockwise rotation", () => {
    expect(
      lookupWinderRotationDirection({ winderDirection: "clockwise" })
        .description,
    ).toContain("clockwise");
  });

  it("describes continuous counterclockwise rotation", () => {
    expect(
      lookupWinderRotationDirection({ winderDirection: "counterclockwise" })
        .description,
    ).toContain("counterclockwise");
  });

  it("avoids a universal TPD setting", () => {
    expect(
      lookupWinderRotationDirection({ winderDirection: "alternating" })
        .directionCaution,
    ).toContain("no universal TPD rule");
  });

  it("rejects an unsupported direction at the public boundary", () => {
    expect(
      runWinderDirection({ winderDirection: "bidirectional" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "winderDirection" }] },
      ok: false,
    });
  });
});
