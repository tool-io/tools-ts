import { describe, expect, it } from "vitest";
import { runSpuriousFreeDynamicRange } from "./tool.js";

describe("SFDR dB", () => {
  it("calculates a valid result", () =>
    expect(
      runSpuriousFreeDynamicRange({ carrierLevelDbm: 0, spurLevelDbm: -90 }),
    ).toEqual({
      ok: true,
      output: { sfdrDb: 90 },
    }));
  it("handles negative carrier levels", () =>
    expect(
      runSpuriousFreeDynamicRange({ carrierLevelDbm: -10, spurLevelDbm: -70 }),
    ).toEqual({
      ok: true,
      output: { sfdrDb: 60 },
    }));
  it("returns zero when the spur equals the carrier", () =>
    expect(
      runSpuriousFreeDynamicRange({ carrierLevelDbm: 5, spurLevelDbm: 5 }),
    ).toEqual({
      ok: true,
      output: { sfdrDb: 0 },
    }));
  it("returns negative range for a spur above the carrier", () =>
    expect(
      runSpuriousFreeDynamicRange({ carrierLevelDbm: -30, spurLevelDbm: -20 }),
    ).toEqual({
      ok: true,
      output: { sfdrDb: -10 },
    }));
  it("rejects a non-finite carrier level", () =>
    expect(
      runSpuriousFreeDynamicRange({
        carrierLevelDbm: Number.NaN,
        spurLevelDbm: -90,
      }).ok,
    ).toBe(false));
  it("rejects a non-finite spur level", () =>
    expect(
      runSpuriousFreeDynamicRange({
        carrierLevelDbm: 0,
        spurLevelDbm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false));
});
