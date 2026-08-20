import { describe, expect, it } from "vitest";
import {
  calculateElectronEffectiveMass,
  electronEffectiveMassExample,
  runElectronEffectiveMass,
} from "./tool.js";

describe("electron effective mass calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runElectronEffectiveMass(electronEffectiveMassExample.input)).toEqual(
      { ok: true, output: electronEffectiveMassExample.output },
    );
  });

  it("matches the silicon literature value near 1.08", () => {
    expect(
      calculateElectronEffectiveMass({
        longitudinalMassRatioX: 0.98,
        transverseMassRatioX: 0.19,
        valleyCount: 6,
      }).dosMassRatioX,
    ).toBeGreaterThan(1.05);
  });

  it("scales with valley count as M^(2/3)", () => {
    const single = calculateElectronEffectiveMass({
      longitudinalMassRatioX: 0.5,
      transverseMassRatioX: 0.5,
      valleyCount: 1,
    });
    const sixValley = calculateElectronEffectiveMass({
      longitudinalMassRatioX: 0.5,
      transverseMassRatioX: 0.5,
      valleyCount: 6,
    });
    expect(single).toEqual({ dosMassRatioX: 0.5 });
    expect(sixValley.dosMassRatioX / single.dosMassRatioX).toBeCloseTo(
      6 ** (2 / 3),
      12,
    );
  });
});
