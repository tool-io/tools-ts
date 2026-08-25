import { describe, expect, it } from "vitest";
import {
  kohReactionNoteGeneratorExample,
  kohReactionNoteGeneratorTool,
  runKohReactionNoteGenerator,
} from "./tool.js";

describe("kohReactionNoteGeneratorTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKohReactionNoteGenerator(kohReactionNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: kohReactionNoteGeneratorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(kohReactionNoteGeneratorExample))).toEqual(
      kohReactionNoteGeneratorExample,
    );
    expect(kohReactionNoteGeneratorTool.contractVersion).toBe(1);
    expect(kohReactionNoteGeneratorTool.execution).toEqual({ kind: "pure" });
  });

  it("notes no change", () => {
    const r = runKohReactionNoteGenerator({ reaction: "no-change" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.kohNote).toBe("KOH: no-change reaction.");
  });

  it("notes orange and green reactions", () => {
    const orange = runKohReactionNoteGenerator({ reaction: "orange" });
    const green = runKohReactionNoteGenerator({ reaction: "green" });
    if (!orange.ok || !green.ok) throw new Error("expected success");
    expect(orange.output.kohNote).toBe("KOH: orange reaction.");
    expect(green.output.kohNote).toBe("KOH: green reaction.");
  });

  it("notes black and reddening reactions", () => {
    const black = runKohReactionNoteGenerator({ reaction: "black" });
    const reddening = runKohReactionNoteGenerator({ reaction: "reddening" });
    if (!black.ok || !reddening.ok) throw new Error("expected success");
    expect(black.output.kohNote).toBe("KOH: black reaction.");
    expect(reddening.output.kohNote).toBe("KOH: reddening reaction.");
  });

  it("always ends the note with a period", () => {
    const r = runKohReactionNoteGenerator({ reaction: "yellow" });
    if (!r.ok) throw new Error("expected success");
    expect((r.output.kohNote as string).endsWith(".")).toBe(true);
    expect((r.output.kohNote as string).startsWith("KOH: ")).toBe(true);
  });

  it("rejects unknown reactions", () => {
    expect(runKohReactionNoteGenerator({ reaction: "purple" }).ok).toBe(false);
    expect(runKohReactionNoteGenerator({ reaction: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runKohReactionNoteGenerator(null).ok).toBe(false);
    expect(runKohReactionNoteGenerator({ reaction: 5 }).ok).toBe(false);
    expect(
      runKohReactionNoteGenerator({
        ...kohReactionNoteGeneratorExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
