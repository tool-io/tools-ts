import { describe, expect, it } from "vitest";
import {
  diplomaticProtocolCheckerExample,
  runDiplomaticProtocolChecker,
} from "./tool.js";

describe("diplomatic-protocol-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDiplomaticProtocolChecker(diplomaticProtocolCheckerExample.input),
    ).toEqual({ ok: true, output: diplomaticProtocolCheckerExample.output });
  });

  it("flags a bare notification with only datation wording", () => {
    expect(
      runDiplomaticProtocolChecker({
        charterText: "Actum apud Eboracum.",
      }),
    ).toEqual({
      ok: true,
      output: {
        detectedElements: ["datation"],
        missingElements: ["invocation", "intitulation", "corroboration"],
        completenessScore: 0.25,
      },
    });
  });

  it("rejects empty text", () => {
    expect(runDiplomaticProtocolChecker({ charterText: "   " }).ok).toBe(false);
  });
});
