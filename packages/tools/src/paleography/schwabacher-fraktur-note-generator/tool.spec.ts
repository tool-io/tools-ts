import { describe, expect, it } from "vitest";
import {
  runSchwabacherFrakturNoteGenerator,
  schwabacherFrakturNoteGeneratorExample,
} from "./tool.js";

describe("schwabacher-fraktur-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSchwabacherFrakturNoteGenerator(
        schwabacherFrakturNoteGeneratorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: schwabacherFrakturNoteGeneratorExample.output,
    });
  });

  it("leans Schwabacher when straight ascenders dominate", () => {
    const result = runSchwabacherFrakturNoteGenerator({
      loopedAscenderCount: 2,
      straightAscenderCount: 8,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict).toBe("schwabacher_leaning");
    expect(result.output.frakturAffinityPct as number).toBe(20);
  });

  it("rejects samples without any ascender", () => {
    expect(
      runSchwabacherFrakturNoteGenerator({
        loopedAscenderCount: 0,
        straightAscenderCount: 0,
      }).ok,
    ).toBe(false);
  });
});
