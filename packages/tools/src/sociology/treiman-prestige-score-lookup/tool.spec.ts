import { describe, expect, it } from "vitest";
import {
  calculateTreimanPrestigeScore,
  treimanPrestigeScoreLookupExample,
  treimanPrestigeScoreLookupTool,
  runTreimanPrestigeScoreLookup,
} from "./tool.js";

describe("treimanPrestigeScoreLookupTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runTreimanPrestigeScoreLookup(treimanPrestigeScoreLookupExample.input),
    ).toEqual({
      ok: true,
      output: treimanPrestigeScoreLookupExample.output,
    });
  });

  it("looks up a supported occupation and rejects unknown labels", () => {
    expect(calculateTreimanPrestigeScore({ occupation: "carpenter" })).toEqual({
      prestigeScore: 39,
    });
    const result = runTreimanPrestigeScoreLookup({ occupation: "astronaut" });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("occupation");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(treimanPrestigeScoreLookupExample)),
    ).toEqual(treimanPrestigeScoreLookupExample);
    expect(treimanPrestigeScoreLookupTool.contractVersion).toBe(1);
    expect(treimanPrestigeScoreLookupTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTreimanPrestigeScoreLookup(null).ok).toBe(false);
    expect(
      runTreimanPrestigeScoreLookup({
        ...treimanPrestigeScoreLookupExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
