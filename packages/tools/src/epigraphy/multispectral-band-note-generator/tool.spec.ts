import { describe, expect, it } from "vitest";
import {
  multispectralBandNoteGeneratorExample,
  runMultispectralBandNoteGenerator,
} from "./tool.js";

describe("multispectral-band-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMultispectralBandNoteGenerator(
        multispectralBandNoteGeneratorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: multispectralBandNoteGeneratorExample.output,
    });
  });

  it("drops the UV band when requested", () => {
    expect(
      runMultispectralBandNoteGenerator({
        inkType: "sepia",
        includeUltraviolet: false,
      }),
    ).toEqual({
      ok: true,
      output: {
        recommendedBands: [
          "visible-light raking illumination",
          "850nm IR reflectography",
        ],
        note: "Sepia ink recommended bands: visible-light raking illumination; 850nm IR reflectography.",
      },
    });
  });
  it("rejects unsupported ink types", () => {
    expect(
      runMultispectralBandNoteGenerator({ inkType: "crayon" as never }).ok,
    ).toBe(false);
  });
});
