import { describe, expect, it } from "vitest";
import {
  ColorParseError,
  clampColorChannel,
  formatHexColor,
  parseHexColor,
} from "./color.js";

describe("core color helpers", () => {
  it("parses six-digit hex colors with or without the hash", () => {
    expect(parseHexColor("#46465A")).toEqual([70, 70, 90]);
    expect(parseHexColor("46465a")).toEqual([70, 70, 90]);
  });

  it("expands three-digit shorthand", () => {
    expect(parseHexColor("#abc")).toEqual([170, 187, 204]);
    expect(parseHexColor("000")).toEqual([0, 0, 0]);
  });

  it("rejects malformed colors", () => {
    for (const value of ["", "#12", "#XYZ", "#1234", "#12345678", "zzz"])
      expect(() => parseHexColor(value)).toThrow(ColorParseError);
  });

  it("formats channels as uppercase hex", () => {
    expect(formatHexColor([70, 70, 90])).toBe("#46465A");
    expect(formatHexColor([0, 0, 0])).toBe("#000000");
  });

  it("rounds and clamps channels when formatting", () => {
    expect(clampColorChannel(127.6)).toBe(128);
    expect(clampColorChannel(-4)).toBe(0);
    expect(clampColorChannel(300)).toBe(255);
    expect(formatHexColor([127.6, -4, 300])).toBe("#8000FF");
  });
});
