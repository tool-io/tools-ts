import { describe, expect, it } from "vitest";
import {
  encodedPolylineDecodeExample,
  runEncodedPolylineDecode,
} from "./tool.js";

describe("decode/encoded-polyline", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEncodedPolylineDecode(encodedPolylineDecodeExample.input),
    ).toEqual({
      ok: true,
      output: encodedPolylineDecodeExample.output,
    });
  });

  it("decodes the full canonical three-point route", () => {
    const result = runEncodedPolylineDecode({
      polyline: "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.coordinates[2]).toEqual([43.252, -126.453]);
  });

  it("rejects empty polylines with structured errors", () => {
    const empty = runEncodedPolylineDecode({ polyline: "" });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error.issues[0]?.code).toBe("empty_polyline");
  });

  it("rejects malformed characters and dangling values", () => {
    const badChar = runEncodedPolylineDecode({ polyline: "a!" });
    expect(badChar.ok).toBe(false);
    if (!badChar.ok)
      expect(badChar.error.issues[0]?.code).toBe("malformed_polyline");
    const dangling = runEncodedPolylineDecode({ polyline: "_p~iF" });
    expect(dangling.ok).toBe(false);
    if (!dangling.ok)
      expect(dangling.error.issues[0]?.code).toBe("malformed_polyline");
  });

  it("honours custom precision factors", () => {
    const result = runEncodedPolylineDecode({
      polyline: "oh\\g}j@",
      precision: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.coordinates[0]).toEqual([1.5, 2.25]);
  });

  it("rejects decoded coordinates outside geographic bounds", () => {
    expect(runEncodedPolylineDecode({ polyline: "_mljP?" })).toMatchObject({
      error: { issues: [{ code: "invalid_latitude" }] },
      ok: false,
    });
  });
});
