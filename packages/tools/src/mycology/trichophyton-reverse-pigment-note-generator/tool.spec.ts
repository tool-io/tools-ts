import { describe, expect, it } from "vitest";
import {
  reversePigmentNoteGeneratorExample,
  reversePigmentNoteGeneratorTool,
  runReversePigmentNoteGenerator,
} from "./tool.js";

describe("Reverse Pigment Note", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runReversePigmentNoteGenerator(reversePigmentNoteGeneratorExample.input),
    ).toEqual({
      ok: true,
      output: reversePigmentNoteGeneratorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(reversePigmentNoteGeneratorExample)),
    ).toEqual(reversePigmentNoteGeneratorExample);
    expect(reversePigmentNoteGeneratorTool.contractVersion).toBe(1);
    expect(reversePigmentNoteGeneratorTool.execution).toEqual({ kind: "pure" });
  });

  it("writes a sentence for each pigmented observation", () => {
    for (const pigment of ["yellow", "red-brown", "violet", "tan"]) {
      const result = runReversePigmentNoteGenerator({ pigment });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.reversePigmentNote).toBe(
          `Reverse pigment: ${pigment}.`,
        );
    }
  });

  it("writes the no-pigment note verbatim", () => {
    const result = runReversePigmentNoteGenerator({ pigment: "no-pigment" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reversePigmentNote).toBe(
        "No reverse pigment on SDA.",
      );
  });

  it("supports the wine-red shade from the enum", () => {
    const result = runReversePigmentNoteGenerator({ pigment: "wine-red" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reversePigmentNote).toBe(
        "Reverse pigment: wine-red.",
      );
  });

  it("rejects pigments outside the observed palette", () => {
    expect(runReversePigmentNoteGenerator({ pigment: "blue" }).ok).toBe(false);
    expect(runReversePigmentNoteGenerator({}).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runReversePigmentNoteGenerator(null).ok).toBe(false);
    expect(runReversePigmentNoteGenerator({ pigment: 3 }).ok).toBe(false);
    expect(
      runReversePigmentNoteGenerator({
        ...reversePigmentNoteGeneratorExample.input,
        note: "x",
      }).ok,
    ).toBe(false);
  });
});
