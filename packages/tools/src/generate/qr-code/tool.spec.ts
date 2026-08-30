import { describe, expect, it } from "vitest";

import { generateQrCode, qrCodeExample, runQrCode } from "./tool.js";

describe("generate/qr-code", () => {
  it("matches its canonical example", () => {
    expect(runQrCode(qrCodeExample.input)).toEqual({
      ok: true,
      output: qrCodeExample.output,
    });
  });

  it("changes the symbol when error correction changes", () => {
    const low = runQrCode({ text: "tool.io", errorCorrection: "L" });
    const high = runQrCode({ text: "tool.io", errorCorrection: "H" });
    expect(low.ok && high.ok && low.output.svg).not.toBe(
      high.ok ? high.output.svg : "",
    );
  });

  it("returns structured failures for invalid input", () => {
    expect(runQrCode({ text: "" })).toMatchObject({
      error: { issues: [{ field: "text" }] },
      ok: false,
    });
    expect(runQrCode(null)).toMatchObject({ ok: false });
  });

  it("renders custom modules, finder colors, and a safely embedded logo", () => {
    const output = generateQrCode({
      errorCorrection: "H",
      finderColor: "#2788e2",
      finderStyle: "rounded",
      logoBackgroundColor: "#ffffff",
      logoDataUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      logoScalePercent: 18,
      moduleStyle: "dots",
      text: "https://tool.io/",
    });
    expect(output.svg).toContain("<circle");
    expect(output.svg).toContain('fill="#2788e2"');
    expect(output.svg).toContain("data:image/png;base64,");
  });

  it("rejects active logo content and styled nonstandard variants", () => {
    expect(() =>
      generateQrCode({
        logoDataUrl:
          "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+PC9zdmc+",
        text: "safe",
      }),
    ).toThrowError(/PNG, JPEG, or WebP/u);
    expect(() =>
      generateQrCode({
        moduleStyle: "dots",
        symbology: "microqrcode",
        text: "safe",
      }),
    ).toThrowError(/standard QR Codes only/u);
  });
});
