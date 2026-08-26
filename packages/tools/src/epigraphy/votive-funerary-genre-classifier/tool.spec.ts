import { describe, expect, it } from "vitest";
import {
  runVotiveFuneraryGenreClassifier,
  votiveFuneraryGenreClassifierExample,
} from "./tool.js";

describe("votive-funerary-genre-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVotiveFuneraryGenreClassifier(
        votiveFuneraryGenreClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: votiveFuneraryGenreClassifierExample.output,
    });
  });

  it("labels overlapping evidence mixed and unmatched words uncertain", () => {
    const mixed = runVotiveFuneraryGenreClassifier({
      formulaWords: ["Dis", "Manibus", "Libens", "Merito"],
    });
    const none = runVotiveFuneraryGenreClassifier({ formulaWords: ["Sacrum"] });
    if (!mixed.ok || !none.ok) throw new Error("expected success");
    expect(mixed.output.genre as string).toBe("mixed");
    expect(mixed.output.matchedMarkers as readonly string[]).toEqual([
      "dis manibus",
      "libens merito",
    ]);
    expect(none.output.genre as string).toBe("uncertain");
  });
  it("rejects blank words", () => {
    expect(runVotiveFuneraryGenreClassifier({ formulaWords: [" "] }).ok).toBe(
      false,
    );
    expect(
      runVotiveFuneraryGenreClassifier({ formulaWords: ["Merito"] }),
    ).toEqual({ ok: true, output: { genre: "uncertain", matchedMarkers: [] } });
  });
});
