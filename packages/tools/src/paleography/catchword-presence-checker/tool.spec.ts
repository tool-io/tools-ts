import { describe, expect, it } from "vitest";
import {
  catchwordPresenceCheckerExample,
  runCatchwordPresenceChecker,
} from "./tool.js";

describe("catchword-presence-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCatchwordPresenceChecker(catchwordPresenceCheckerExample.input),
    ).toEqual({ ok: true, output: catchwordPresenceCheckerExample.output });
  });

  it("reports no match for unrelated lines", () => {
    const result = runCatchwordPresenceChecker({
      versoTailText: "finis coronat opus",
      followingRectoHeadText: "Incipit prologus",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.catchwordMatch as boolean).toBe(false);
    expect(result.output.matchedWord as string).toBe("");
  });

  it("rejects empty tail text", () => {
    expect(
      runCatchwordPresenceChecker({
        versoTailText: "",
        followingRectoHeadText: "incipit",
      }).ok,
    ).toBe(false);
    expect(
      runCatchwordPresenceChecker({
        versoTailText: "---",
        followingRectoHeadText: "incipit",
      }).ok,
    ).toBe(false);
  });
});
