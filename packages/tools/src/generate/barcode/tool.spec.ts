import { describe, expect, it } from "vitest";

import { barcodeExample, generateBarcode, runBarcode } from "./tool.js";

describe("generate/barcode", () => {
  it("matches its canonical example", () => {
    expect(runBarcode(barcodeExample.input)).toEqual({
      ok: true,
      output: barcodeExample.output,
    });
  });

  it("generates a valid EAN-13 symbol", () => {
    const result = runBarcode({
      includeText: true,
      symbology: "ean13",
      text: "4006381333931",
    });
    expect(result.ok && result.output.svg).toMatch(/^<svg\b/u);
  });

  it("rejects values that the selected encoder cannot represent", () => {
    expect(
      runBarcode({ symbology: "ean13", text: "not-an-ean" }),
    ).toMatchObject({
      error: { issues: [{ code: "encoding_failed", field: "text" }] },
      ok: false,
    });
  });

  it("places branding outside the measured symbol and supports a frame", () => {
    const plain = generateBarcode({ symbology: "code128", text: "TOOL.IO" });
    const branded = generateBarcode({
      borderColor: "#2788e2",
      frameStyle: "rounded",
      logoDataUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      logoPlacement: "left",
      symbology: "code128",
      text: "TOOL.IO",
    });
    expect(branded.width).toBeGreaterThan(plain.width);
    expect(branded.svg).toContain("data:image/png;base64,");
    expect(branded.svg).toContain('stroke="#2788e2"');
  });

  it("rejects an active SVG masquerading as a logo", () => {
    expect(() =>
      generateBarcode({
        logoDataUrl:
          "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+",
        symbology: "code128",
        text: "safe",
      }),
    ).toThrowError(/PNG, JPEG, or WebP/u);
  });
});
