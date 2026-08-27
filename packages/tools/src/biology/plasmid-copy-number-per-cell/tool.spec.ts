import { describe, expect, it } from "vitest";
import { runPlasmidCopyNumberPerCell } from "./tool.js";

describe("Plasmid Copies Per Cell", () => {
  it("defaults to one host genome copy", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeLengthBp: 4600000,
        genomeNg: 5000,
        plasmidLengthBp: 3000,
        plasmidNg: 25,
      }),
    ).toEqual({
      ok: true,
      output: { plasmidCopiesPerCell: 7.666666666666666 },
    }));
  it("multiplies by the host genome copy number", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeNg: 5000,
        genomeLengthBp: 4600000,
        hostCopies: 4,
        plasmidLengthBp: 3000,
        plasmidNg: 25,
      }),
    ).toEqual({
      ok: true,
      output: { plasmidCopiesPerCell: 30.666666666666664 },
    }));
  it("returns the host copies at equal masses", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeNg: 400,
        genomeLengthBp: 3000,
        hostCopies: 3,
        plasmidLengthBp: 3000,
        plasmidNg: 400,
      }),
    ).toEqual({
      ok: true,
      output: { plasmidCopiesPerCell: 3 },
    }));
  it("rejects zero plasmid mass", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeLengthBp: 4600000,
        genomeNg: 5000,
        plasmidLengthBp: 3000,
        plasmidNg: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative genome mass", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeLengthBp: 4600000,
        genomeNg: -5000,
        plasmidLengthBp: 3000,
        plasmidNg: 25,
      }).ok,
    ).toBe(false));
  it("rejects fractional host copies", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeNg: 5000,
        genomeLengthBp: 4600000,
        hostCopies: 1.5,
        plasmidLengthBp: 3000,
        plasmidNg: 25,
      }).ok,
    ).toBe(false));
  it("rejects host copies below one", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeNg: 5000,
        genomeLengthBp: 4600000,
        hostCopies: 0,
        plasmidLengthBp: 3000,
        plasmidNg: 25,
      }).ok,
    ).toBe(false));
  it("rejects zero molecule lengths", () =>
    expect(
      runPlasmidCopyNumberPerCell({
        genomeLengthBp: 4600000,
        genomeNg: 5000,
        plasmidLengthBp: 0,
        plasmidNg: 25,
      }).ok,
    ).toBe(false));
});
