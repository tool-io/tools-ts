import { describe, expect, it } from "vitest";
import {
  calculateSinistroverseDirectionFlag,
  runSinistroverseDirectionFlag,
  sinistroverseDirectionFlagExample,
} from "./tool.js";

describe("epigraphy/sinistroverse-direction-flag", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSinistroverseDirectionFlag(sinistroverseDirectionFlagExample.input),
    ).toEqual({ ok: true, output: sinistroverseDirectionFlagExample.output });
  });

  it("normalizes case and synonym tokens", () => {
    expect(
      calculateSinistroverseDirectionFlag({ direction: "  Right-To-Left " }),
    ).toEqual({ isSinistroverse: true, normalized: "sinistroverse" });
    expect(calculateSinistroverseDirectionFlag({ direction: "ltr" })).toEqual({
      isSinistroverse: false,
      normalized: "dextroverse",
    });
  });

  it("rejects unknown or empty direction tokens", () => {
    expect(runSinistroverseDirectionFlag({ direction: "upward" }).ok).toBe(
      false,
    );
    expect(runSinistroverseDirectionFlag({ direction: "" }).ok).toBe(false);
  });
});
