import { describe, expect, it } from "vitest";
import {
  onomasticOriginHintScorerExample,
  runOnomasticOriginHintScorer,
} from "./tool.js";

describe("onomastic-origin-hint-scorer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOnomasticOriginHintScorer(onomasticOriginHintScorerExample.input),
    ).toEqual({
      ok: true,
      output: onomasticOriginHintScorerExample.output,
    });
  });

  it("reports uncertain when markers tie or are all absent", () => {
    const tie = runOnomasticOriginHintScorer({
      hasLatinGentilicium: true,
      hasGreekElements: true,
      hasLocalEpithet: false,
    });
    const none = runOnomasticOriginHintScorer({
      hasLatinGentilicium: false,
      hasGreekElements: false,
      hasLocalEpithet: false,
    });
    if (!tie.ok || !none.ok) throw new Error("expected success");
    expect(tie.output.hint as string).toBe("uncertain");
    expect(none.output.hint as string).toBe("uncertain");
  });
  it("rejects non-boolean markers", () => {
    expect(
      runOnomasticOriginHintScorer({
        hasLatinGentilicium: "yes" as never,
        hasGreekElements: false,
        hasLocalEpithet: false,
      }).ok,
    ).toBe(false);
  });
});
