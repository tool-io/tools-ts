import { describe, expect, it } from "vitest";
import { runGeohashEncode } from "../../encode/geohash/tool.js";
import { geohashDecodeExample, runGeohashDecode } from "./tool.js";

describe("decode/geohash", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGeohashDecode(geohashDecodeExample.input)).toEqual({
      ok: true,
      output: geohashDecodeExample.output,
    });
  });

  it("round-trips against the encoder", () => {
    const encoded = runGeohashEncode({
      latitude: 57.64911,
      longitude: 10.40744,
      precision: 10,
    });
    expect(encoded.ok && (encoded.output.geohash as string)).toBe("u4pruydqqv");
    const decoded = runGeohashDecode({ geohash: "u4pruydqqv" });
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.output.south as number).toBeLessThanOrEqual(57.64911);
      expect(decoded.output.north as number).toBeGreaterThanOrEqual(57.64911);
      expect(decoded.output.west as number).toBeLessThanOrEqual(10.40744);
      expect(decoded.output.east as number).toBeGreaterThanOrEqual(10.40744);
    }
  });

  it("rejects empty and invalid hashes with structured errors", () => {
    const empty = runGeohashDecode({ geohash: "" });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error.issues[0]?.code).toBe("empty_geohash");
    const malformed = runGeohashDecode({ geohash: "eza9" });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok)
      expect(malformed.error.issues[0]?.code).toBe("malformed_geohash");
  });
});
