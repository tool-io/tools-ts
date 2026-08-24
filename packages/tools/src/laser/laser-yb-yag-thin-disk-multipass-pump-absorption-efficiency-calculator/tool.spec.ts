import { describe, expect, it } from "vitest";
import {
  runThinDiskAbsorption,
  thinDiskAbsorptionExample as example,
} from "./tool.js";
describe("Yb:YAG thin-disk absorption", () => {
  it("reproduces the stable multipass calculation", () =>
    expect(runThinDiskAbsorption(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("requires an integer pass count and valid overlap", () => {
    expect(runThinDiskAbsorption({ passes: 1.5 }).ok).toBe(false);
    expect(runThinDiskAbsorption({ overlapFraction: 0 }).ok).toBe(false);
  });
});
