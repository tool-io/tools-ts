import { describe, expect, it } from "vitest";
import { runPlasmidCopyNumber } from "./tool.js";

describe("Plasmid Copy Number", () => {
  it("calculates a valid result", () =>
    expect(
      runPlasmidCopyNumber({
        plasmidConcNgUl: 40,
        genomeConcNgUl: 20,
        plasmidLengthBp: 3000,
        genomeSizeBp: 6000,
      }),
    ).toEqual({
      ok: true,
      output: { plasmidCopyNumberPerGenome: 4 },
    }));
  it("balances concentration and length ratios", () =>
    expect(
      runPlasmidCopyNumber({
        plasmidConcNgUl: 10,
        genomeConcNgUl: 20,
        plasmidLengthBp: 500,
        genomeSizeBp: 2000,
      }),
    ).toEqual({
      ok: true,
      output: { plasmidCopyNumberPerGenome: 2 },
    }));
  it("rejects zero concentrations or sizes", () =>
    expect(
      runPlasmidCopyNumber({
        plasmidConcNgUl: 40,
        genomeConcNgUl: 0,
        plasmidLengthBp: 3000,
        genomeSizeBp: 6000,
      }).ok,
    ).toBe(false));
  it("rejects zero plasmid length", () =>
    expect(
      runPlasmidCopyNumber({
        plasmidConcNgUl: 40,
        genomeConcNgUl: 20,
        plasmidLengthBp: 0,
        genomeSizeBp: 6000,
      }).ok,
    ).toBe(false));
  it("rejects negative inputs", () =>
    expect(
      runPlasmidCopyNumber({
        plasmidConcNgUl: -40,
        genomeConcNgUl: 20,
        plasmidLengthBp: 3000,
        genomeSizeBp: 6000,
      }).ok,
    ).toBe(false));
});
