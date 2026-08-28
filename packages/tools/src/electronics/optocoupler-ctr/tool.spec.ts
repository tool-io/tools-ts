import { describe, expect, it } from "vitest";
import {
  calculateOptocouplerCtr,
  optocouplerCtrExample,
  runOptocouplerCtr,
} from "./tool.js";

describe("CTR Percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOptocouplerCtr(optocouplerCtrExample.input)).toEqual({
      ok: true,
      output: optocouplerCtrExample.output,
    });
  });

  it("reports one hundred percent for matched currents", () => {
    expect(
      calculateOptocouplerCtr({ collectorCurrentMa: 4, ledForwardMa: 4 })
        .currentTransferRatioPercent,
    ).toBe(100);
  });

  it("reports zero percent for zero collector current", () => {
    expect(
      runOptocouplerCtr({ collectorCurrentMa: 0, ledForwardMa: 8 }),
    ).toEqual({
      ok: true,
      output: { currentTransferRatioPercent: 0 },
    });
  });

  it("scales inversely with LED current", () => {
    expect(
      calculateOptocouplerCtr({ collectorCurrentMa: 6, ledForwardMa: 20 })
        .currentTransferRatioPercent,
    ).toBe(30);
  });

  it("rejects zero LED forward current via invalid_current", () => {
    expect(
      runOptocouplerCtr({ collectorCurrentMa: 5, ledForwardMa: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "ledForwardMa" }] },
      ok: false,
    });
  });

  it("rejects negative LED forward current via invalid_current", () => {
    expect(
      runOptocouplerCtr({ collectorCurrentMa: 5, ledForwardMa: -2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "ledForwardMa" }] },
      ok: false,
    });
  });

  it("rejects negative collector current via invalid_current", () => {
    expect(
      runOptocouplerCtr({ collectorCurrentMa: -1, ledForwardMa: 5 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "collectorCurrentMa" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runOptocouplerCtr({ ledForwardMa: 5 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "collectorCurrentMa" }],
      },
      ok: false,
    });
  });
});
