import { describe, expect, it } from "vitest";
import {
  calculateIiifImageUrlFormatterV2,
  iiifImageUrlFormatterV2Example,
  runIiifImageUrlFormatterV2,
} from "./tool.js";

describe("archival-studies/iiif-image-url-formatter-v2", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIiifImageUrlFormatterV2(iiifImageUrlFormatterV2Example.input),
    ).toEqual({ ok: true, output: iiifImageUrlFormatterV2Example.output });
  });

  it("normalizes rotations beyond one full turn", () => {
    const result = calculateIiifImageUrlFormatterV2({
      baseUrl: "https://iiif.example.org/",
      identifier: "ms042_f003",
      rotation: 405,
    });
    expect(result.normalizedRotation).toBe(45);
    expect(result.url).toBe(
      "https://iiif.example.org/ms042_f003/full/full/45/default.jpg",
    );
  });

  it("percent-encodes identifiers as one IIIF path segment", () => {
    expect(
      calculateIiifImageUrlFormatterV2({
        baseUrl: "https://iiif.example.org/",
        identifier: "collection/item 1",
      }).url,
    ).toBe(
      "https://iiif.example.org/collection%2Fitem%201/full/full/0/default.jpg",
    );
  });

  it("rejects empty identifiers", () => {
    expect(
      runIiifImageUrlFormatterV2({
        baseUrl: "https://iiif.example.org",
        identifier: "  ",
      }).ok,
    ).toBe(false);
  });
});
