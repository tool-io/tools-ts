import { describe, expect, it } from "vitest";
import { storativityConfinedExample, runStorativityConfined } from "./tool.js";

describe("storativity-confined", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStorativityConfined(storativityConfinedExample.input)).toEqual({
      ok: true,
      output: storativityConfinedExample.output,
    });
  });

  it("scales storativity linearly with thickness", () => {
    const result = runStorativityConfined({
      aquiferThicknessM: 100,
      specificStoragePerM: 2e-6,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.storativity as number).toBeCloseTo(0.0002, 15);
  });

  it("rejects negative specific storage", () => {
    expect(
      runStorativityConfined({
        aquiferThicknessM: 50,
        specificStoragePerM: -1e-6,
      }).ok,
    ).toBe(false);
  });
});
