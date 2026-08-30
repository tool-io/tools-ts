import { describe, expect, it } from "vitest";
import {
  lookupSixPositionOrientation,
  runSixPosition,
  sixPositionExample,
} from "./tool.js";

describe("six-position orientation code lookup", () => {
  it("reproduces the canonical 9H orientation", () => {
    expect(runSixPosition(sixPositionExample.input)).toEqual({
      ok: true,
      output: sixPositionExample.output,
    });
  });

  it("maps both horizontal codes", () => {
    expect(
      lookupSixPositionOrientation({ positionCode: "CH" }).orientation,
    ).toBe("dial up");
    expect(
      lookupSixPositionOrientation({ positionCode: "CB" }).orientation,
    ).toBe("dial down");
  });

  it("maps all vertical codes", () => {
    expect(
      ["9H", "6H", "3H", "12H"].map(
        (positionCode) =>
          lookupSixPositionOrientation({
            positionCode: positionCode as "9H" | "6H" | "3H" | "12H",
          }).orientation,
      ),
    ).toEqual(["crown down", "crown left", "crown up", "crown right"]);
  });

  it("separates workshop positions from the five-position COSC list", () => {
    expect(
      lookupSixPositionOrientation({ positionCode: "CH" }).certificationCaution,
    ).toContain("five-position");
  });

  it("rejects an unsupported code at the public boundary", () => {
    expect(runSixPosition({ positionCode: "FH" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "positionCode" }] },
      ok: false,
    });
  });
});
