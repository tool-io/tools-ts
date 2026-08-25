import { describe, expect, it } from "vitest";
import { runTruffleAromaTraceNoteGenerator } from "./tool.js";
describe("Aroma Trace Note", () => {
  it("notes a musky garlic trace", () =>
    expect(
      runTruffleAromaTraceNoteGenerator({ aroma: "musky-garlic" }),
    ).toEqual({
      ok: true,
      output: { aromaTraceNote: "Distinctive trace: musky-garlic." },
    }));
  it("notes a sulfurous trace", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "sulfurous" })).toEqual({
      ok: true,
      output: { aromaTraceNote: "Distinctive trace: sulfurous." },
    }));
  it("notes a nutty trace", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "nutty" })).toEqual({
      ok: true,
      output: { aromaTraceNote: "Distinctive trace: nutty." },
    }));
  it("notes a fruity trace", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "fruity" })).toEqual({
      ok: true,
      output: { aromaTraceNote: "Distinctive trace: fruity." },
    }));
  it("reports no distinctive trace when faint", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "faint-none" })).toEqual({
      ok: true,
      output: { aromaTraceNote: "No distinctive aroma trace." },
    }));
  it("accepts every supported aroma", () => {
    for (const aroma of [
      "musky-garlic",
      "sulfurous",
      "nutty",
      "fruity",
      "faint-none",
    ])
      expect(runTruffleAromaTraceNoteGenerator({ aroma }).ok).toBe(true);
  });
  it("rejects unsupported aromas", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "spicy" }).ok).toBe(
      false,
    ));
  it("rejects empty aromas", () =>
    expect(runTruffleAromaTraceNoteGenerator({ aroma: "" }).ok).toBe(false));
});
