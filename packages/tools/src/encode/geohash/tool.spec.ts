import { describe, expect, it } from "vitest";
import { runGeohashDecode } from "../../decode/geohash/tool.js";
import { geohashEncodeExample, runGeohashEncode } from "./tool.js";

describe("encode/geohash", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGeohashEncode(geohashEncodeExample.input)).toEqual({
      ok: true,
      output: geohashEncodeExample.output,
    });
  });

  it("defaults to nine characters and prefixes longer hashes", () => {
    const nine = runGeohashEncode({ latitude: 57.64911, longitude: 10.40744 });
    expect(nine.ok && (nine.output.geohash as string)).toBe("u4pruydqq");
    const twelve = runGeohashEncode({
      latitude: 57.64911,
      longitude: 10.40744,
      precision: 12,
    });
    expect(
      twelve.ok && (twelve.output.geohash as string).startsWith("u4pruydqq"),
    ).toBe(true);
  });

  it("round-trips against the decoder", () => {
    const encoded = runGeohashEncode({
      latitude: -25.34449,
      longitude: 131.03691,
    });
    const decoded = encoded.ok
      ? runGeohashDecode({ geohash: encoded.output.geohash as string })
      : undefined;
    expect(decoded?.ok).toBe(true);
    if (decoded?.ok) {
      expect(decoded.output.south as number).toBeLessThanOrEqual(-25.34449);
      expect(decoded.output.north as number).toBeGreaterThanOrEqual(-25.34449);
      expect(decoded.output.west as number).toBeLessThanOrEqual(131.03691);
      expect(decoded.output.east as number).toBeGreaterThanOrEqual(131.03691);
    }
  });

  it("rejects out-of-range coordinates via schema validation", () => {
    expect(runGeohashEncode({ latitude: 91, longitude: 0 }).ok).toBe(false);
    expect(runGeohashEncode({ latitude: 0, longitude: -181 }).ok).toBe(false);
  });
});
