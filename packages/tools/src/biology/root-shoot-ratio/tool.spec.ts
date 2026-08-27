import { describe, expect, it } from "vitest";
import { runRootShootRatio } from "./tool.js";

describe("Root-Shoot Ratio", () => {
  it("calculates a valid result", () =>
    expect(runRootShootRatio({ rootDryMassG: 30, shootDryMassG: 60 })).toEqual({
      ok: true,
      output: { rootShootRatio: 0.5 },
    }));
  it("equals one for equal biomasses", () => {
    const result = runRootShootRatio({ rootDryMassG: 45, shootDryMassG: 45 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.rootShootRatio).toBe(1);
  });
  it("allows zero root mass", () => {
    const result = runRootShootRatio({ rootDryMassG: 0, shootDryMassG: 30 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.rootShootRatio).toBe(0);
  });
  it("supports ratios above one", () => {
    const result = runRootShootRatio({ rootDryMassG: 90, shootDryMassG: 30 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.rootShootRatio).toBe(3);
  });
  it("rejects zero shoot mass", () =>
    expect(runRootShootRatio({ rootDryMassG: 30, shootDryMassG: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative shoot mass", () =>
    expect(runRootShootRatio({ rootDryMassG: 30, shootDryMassG: -5 }).ok).toBe(
      false,
    ));
  it("rejects negative root mass", () =>
    expect(runRootShootRatio({ rootDryMassG: -1, shootDryMassG: 60 }).ok).toBe(
      false,
    ));
});
