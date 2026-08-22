import { describe, expect, it } from "vitest";
import { runVappSpeed, vappSpeedExample } from "./tool.js";

describe("vapp speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVappSpeed(vappSpeedExample.input)).toEqual({
      ok: true,
      output: vappSpeedExample.output,
    });
  });

  it("defaults to the reference speed without wind additive", () => {
    expect(runVappSpeed({ vrefKt: 70 })).toEqual({
      ok: true,
      output: { vappKt: 70 },
    });
  });

  it("rejects negative corrections through execution", () => {
    expect(runVappSpeed({ vrefKt: 70, windCorrectionKt: -5 }).ok).toBe(false);
  });
});
