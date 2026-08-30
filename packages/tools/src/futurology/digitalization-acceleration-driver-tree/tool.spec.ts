import { describe, expect, it } from "vitest";
import {
  digitalizationTreeExample,
  runDigitalizationTree,
  validateDigitalizationDriverTree,
} from "./tool.js";

describe("digitalization acceleration driver tree", () => {
  it("reproduces its canonical example", () => {
    expect(runDigitalizationTree(digitalizationTreeExample.input)).toEqual({
      ok: true,
      output: digitalizationTreeExample.output,
    });
  });

  it("calculates multi-level depth", () => {
    expect(
      validateDigitalizationDriverTree({
        driverIds: ["Root", "Child", "Grandchild"],
        parentIndices: [-1, 0, 1],
      }).maximumDepth,
    ).toBe(2);
  });

  it("rejects multiple roots", () => {
    expect(
      validateDigitalizationDriverTree({
        driverIds: ["A", "B"],
        parentIndices: [-1, -1],
      }),
    ).toMatchObject({ rootCount: 2, validTree: false });
  });

  it("detects a parent cycle", () => {
    expect(
      validateDigitalizationDriverTree({
        driverIds: ["A", "B"],
        parentIndices: [1, 0],
      }).validTree,
    ).toBe(false);
  });
});
