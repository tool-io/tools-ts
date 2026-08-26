import { describe, expect, it } from "vitest";
import { runTackDistance, tackDistanceExample } from "./tool.js";

describe("tack distance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTackDistance(tackDistanceExample.input)).toEqual({
      ok: true,
      output: tackDistanceExample.output,
    });
  });

  it("rejects out-of-range angles through execution", () => {
    expect(runTackDistance({ lateralOffsetNm: 2, tackAngleDeg: 0 }).ok).toBe(
      false,
    );
    expect(runTackDistance({ lateralOffsetNm: 2, tackAngleDeg: 90 }).ok).toBe(
      false,
    );
  });

  it("rejects a negative lateral offset", () => {
    expect(runTackDistance({ lateralOffsetNm: -1, tackAngleDeg: 45 }).ok).toBe(
      false,
    );
  });
});
