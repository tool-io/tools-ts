import { describe, expect, it } from "vitest";
import {
  cystidiaPositionNoteGeneratorExample,
  runCystidiaPositionNoteGenerator,
} from "./tool.js";

describe("Cystidia Position Note", () => {
  it("matches the canonical example", () => {
    expect(
      runCystidiaPositionNoteGenerator(
        cystidiaPositionNoteGeneratorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cystidiaPositionNoteGeneratorExample.output,
    });
  });
  it("describes lamellar-face positions", () =>
    expect(
      runCystidiaPositionNoteGenerator({ position: "lamellar-face" }),
    ).toEqual({
      ok: true,
      output: {
        cystidiaNote:
          "Cystidia observed on the lamellar face (pleurocystidial position).",
      },
    }));
  it("describes both positions", () =>
    expect(runCystidiaPositionNoteGenerator({ position: "both" })).toEqual({
      ok: true,
      output: {
        cystidiaNote:
          "Cystidia observed on both the lamellar edge and face (cheilocystidial and pleurocystidial positions).",
      },
    }));
  it("describes cortical positions", () =>
    expect(runCystidiaPositionNoteGenerator({ position: "cortical" })).toEqual({
      ok: true,
      output: {
        cystidiaNote: "Cystidia observed in the outer cortical tissue.",
      },
    }));
  it("describes terminal positions", () =>
    expect(runCystidiaPositionNoteGenerator({ position: "terminal" })).toEqual({
      ok: true,
      output: { cystidiaNote: "Cystidia observed at hyphal termini." },
    }));
  it("rejects unknown positions", () =>
    expect(
      runCystidiaPositionNoteGenerator({
        position: "stipe-base",
      } as unknown as { position: "cortical" }).ok,
    ).toBe(false));
  it("requires the position field", () =>
    expect(
      runCystidiaPositionNoteGenerator(
        {} as unknown as { position: "cortical" },
      ).ok,
    ).toBe(false));
});
