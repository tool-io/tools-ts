import { describe, expect, it } from "vitest";
import {
  carbonIrongallNoteGeneratorExample,
  runCarbonIrongallNoteGenerator,
} from "./tool.js";

describe("carbon-irongall-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCarbonIrongallNoteGenerator(carbonIrongallNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: carbonIrongallNoteGeneratorExample.output,
    });
  });

  it("reports mixed indications on a tie", () => {
    const result = runCarbonIrongallNoteGenerator({
      opaqueBlackCore: true,
      haloBleeding: true,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verdict).toBe("mixed_indications");
    expect(result.output.note).toContain(
      "non-destructive instrumental analysis",
    );
  });

  it("rejects unknown fields", () => {
    expect(runCarbonIrongallNoteGenerator({ phTest: true }).ok).toBe(false);
  });
});
