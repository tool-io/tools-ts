import { describe, expect, it } from "vitest";
import { runMarblingScore } from "./tool.js";

describe("Marbling Score Lookup", () => {
  it("classifies one percent as slight", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 1 })).toEqual({
      ok: true,
      output: { marblingCategory: "slight" },
    }));
  it("classifies counts just below three percent as slight", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 2.9 })).toEqual({
      ok: true,
      output: { marblingCategory: "slight" },
    }));
  it("classifies three percent as modest", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 3 })).toEqual({
      ok: true,
      output: { marblingCategory: "modest" },
    }));
  it("classifies counts just below six percent as modest", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 5.9 })).toEqual({
      ok: true,
      output: { marblingCategory: "modest" },
    }));
  it("classifies six percent as moderate", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 6 })).toEqual({
      ok: true,
      output: { marblingCategory: "moderate" },
    }));
  it("classifies counts just below nine percent as moderate", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 8.9 })).toEqual({
      ok: true,
      output: { marblingCategory: "moderate" },
    }));
  it("classifies nine percent as abundant", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 9 })).toEqual({
      ok: true,
      output: { marblingCategory: "abundant" },
    }));
  it("classifies the maximum thirteen percent as abundant", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 13 })).toEqual({
      ok: true,
      output: { marblingCategory: "abundant" },
    }));
  it("rejects percentages below one", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 0.9 }).ok).toBe(false));
  it("rejects percentages above thirteen", () =>
    expect(runMarblingScore({ intramuscularFatPercent: 13.1 }).ok).toBe(false));
});
