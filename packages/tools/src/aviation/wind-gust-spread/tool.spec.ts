import { describe, expect, it } from "vitest";
import { runWindGustSpread } from "./tool.js";

describe("wind gust spread calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWindGustSpread({ gustKt: 25, windKt: 15 })).toEqual({
      ok: true,
      output: { gustSpreadKt: 10 },
    });
  });
  it("reports zero when the gust equals the sustained wind", () => {
    expect(runWindGustSpread({ gustKt: 20, windKt: 20 })).toEqual({
      ok: true,
      output: { gustSpreadKt: 0 },
    });
  });
});
