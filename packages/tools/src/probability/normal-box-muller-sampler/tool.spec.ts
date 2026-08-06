import { describe, expect, it } from "vitest";
import {
  normalBoxMullerExample,
  randomNormal,
  runNormalBoxMuller,
  sampleNormalBoxMuller,
} from "./tool.js";

describe("Normal Box-Muller Sampler", () => {
  it("is deterministic", () =>
    expect(sampleNormalBoxMuller(0, 1, 3, "same")).toEqual(
      sampleNormalBoxMuller(0, 1, 3, "same"),
    ));
  it("supports a zero standard deviation", () =>
    expect(sampleNormalBoxMuller(4, 0, 2, "seed")).toEqual([4, 4]));
  it("rejects invalid random sources", () =>
    expect(randomNormal(() => 2)).toBeNull());
  it("publishes an executable example", () =>
    expect(runNormalBoxMuller(normalBoxMullerExample.input)).toEqual({
      ok: true,
      output: normalBoxMullerExample.output,
    }));
});
