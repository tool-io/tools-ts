import { describe, expect, it } from "vitest";
import {
  hairlineFleshNoteGeneratorExample,
  runHairlineFleshNoteGenerator,
} from "./tool.js";

describe("hairline-flesh-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHairlineFleshNoteGenerator(hairlineFleshNoteGeneratorExample.input),
    ).toEqual({ ok: true, output: hairlineFleshNoteGeneratorExample.output });
  });

  it("flips the sides for a flesh-first leaf", () => {
    const result = runHairlineFleshNoteGenerator({ firstPageSide: "flesh" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rectoSkinSide as string).toBe("flesh");
    expect(result.output.versoSkinSide as string).toBe("hair");
    expect(result.output.catalogueNote as string).toBe(
      "Recto shows the flesh side and verso the hair side.",
    );
  });
});
