import { describe, expect, it } from "vitest";
import { runEncodedPolylineDecode } from "../../decode/encoded-polyline/tool.js";
import {
  encodedPolylineEncodeExample,
  runEncodedPolylineEncode,
} from "./tool.js";

describe("encode/encoded-polyline", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEncodedPolylineEncode(encodedPolylineEncodeExample.input),
    ).toEqual({
      ok: true,
      output: encodedPolylineEncodeExample.output,
    });
  });

  it("round-trips against the decoder", () => {
    const decoded = runEncodedPolylineDecode({
      polyline: encodedPolylineEncodeExample.output.polyline,
    });
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const reencoded = runEncodedPolylineEncode({
      coordinates: decoded.output.coordinates,
    });
    expect(reencoded.ok && reencoded.output.polyline).toBe(
      encodedPolylineEncodeExample.output.polyline,
    );
  });

  it("rejects empty coordinate lists and bad rows with structured errors", () => {
    const empty = runEncodedPolylineEncode({ coordinates: [] });
    expect(empty.ok).toBe(false);
    if (!empty.ok)
      expect(empty.error.issues[0]?.code).toBe("empty_coordinates");
    const badRow = runEncodedPolylineEncode({ coordinates: [[1, 2, 3]] });
    expect(badRow.ok).toBe(false);
    if (!badRow.ok)
      expect(badRow.error.issues[0]?.code).toBe("invalid_coordinate");
  });

  it("supports coordinate precision beyond 32-bit bitwise ranges", () => {
    const encoded = runEncodedPolylineEncode({
      coordinates: [[12.3456789, -98.7654321]],
      precision: 8,
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = runEncodedPolylineDecode({
      polyline: encoded.output.polyline,
      precision: 8,
    });
    expect(decoded).toEqual({
      ok: true,
      output: { coordinates: [[12.3456789, -98.7654321]] },
    });
  });

  it("rejects coordinates outside geographic bounds", () => {
    expect(runEncodedPolylineEncode({ coordinates: [[91, 0]] })).toMatchObject({
      error: { issues: [{ code: "invalid_latitude" }] },
      ok: false,
    });
    expect(runEncodedPolylineEncode({ coordinates: [[0, 181]] })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_longitude" }] },
        ok: false,
      },
    );
  });
});
