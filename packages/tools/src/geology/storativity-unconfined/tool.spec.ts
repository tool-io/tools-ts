import { describe, expect, it } from "vitest";
import {
  storativityUnconfinedExample,
  runStorativityUnconfined,
} from "./tool.js";

describe("storativity-unconfined", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStorativityUnconfined(storativityUnconfinedExample.input),
    ).toEqual({
      ok: true,
      output: storativityUnconfinedExample.output,
    });
  });

  it("falls back to specific yield when elastic storage vanishes", () => {
    const result = runStorativityUnconfined({
      specificYield: 0.2,
      saturatedThicknessM: 10,
      specificStoragePerM: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.storativity as number).toBe(0.2);
  });

  it("rejects specific yields outside zero to one", () => {
    expect(
      runStorativityUnconfined({
        specificYield: 1.5,
        saturatedThicknessM: 10,
        specificStoragePerM: 1e-6,
      }).ok,
    ).toBe(false);
  });
});
