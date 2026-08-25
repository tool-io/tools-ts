import { describe, expect, it } from "vitest";
import {
  cloneAreaNoteGeneratorExample,
  cloneAreaNoteGeneratorTool,
  runCloneAreaNoteGenerator,
} from "./tool.js";

describe("Clone Area Note", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCloneAreaNoteGenerator(cloneAreaNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: cloneAreaNoteGeneratorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cloneAreaNoteGeneratorExample))).toEqual(
      cloneAreaNoteGeneratorExample,
    );
    expect(cloneAreaNoteGeneratorTool.contractVersion).toBe(1);
    expect(cloneAreaNoteGeneratorTool.execution).toEqual({ kind: "pure" });
  });

  it("formats whole-number areas into the note", () => {
    const result = runCloneAreaNoteGenerator({ areaHectares: 9 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.genetAreaNote).toBe(
        "Genet covers approximately 9 ha.",
      );
  });

  it("formats fractional areas with their given precision", () => {
    const result = runCloneAreaNoteGenerator({ areaHectares: 0.75 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.genetAreaNote).toBe(
        "Genet covers approximately 0.75 ha.",
      );
  });

  it("accepts very small positive areas", () => {
    const result = runCloneAreaNoteGenerator({ areaHectares: 0.01 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.genetAreaNote).toBe(
        "Genet covers approximately 0.01 ha.",
      );
  });

  it("rejects zero and negative areas", () => {
    expect(runCloneAreaNoteGenerator({ areaHectares: 0 }).ok).toBe(false);
    expect(runCloneAreaNoteGenerator({ areaHectares: -4 }).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runCloneAreaNoteGenerator(null).ok).toBe(false);
    expect(runCloneAreaNoteGenerator({ areaHectares: "2.5" }).ok).toBe(false);
    expect(
      runCloneAreaNoteGenerator({
        ...cloneAreaNoteGeneratorExample.input,
        note: "x",
      }).ok,
    ).toBe(false);
  });
});
