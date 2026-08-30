import { describe, expect, it } from "vitest";

import {
  barcodeSymbologies,
  buildCalendarQrPayload,
  buildContactQrPayload,
  buildEmailQrPayload,
  buildLocationQrPayload,
  buildOtpQrPayload,
  buildPhoneQrPayload,
  buildSmsQrPayload,
  buildUrlQrPayload,
  buildWifiQrPayload,
  codeSymbologies,
  generateCodeImage,
  qrCodeSymbologies,
} from "./index.js";

describe("code image registry", () => {
  it("publishes every encoder with unique stable identifiers", () => {
    expect(codeSymbologies).toHaveLength(111);
    expect(new Set(codeSymbologies.map(({ bcid }) => bcid)).size).toBe(111);
    expect(new Set(codeSymbologies.map(({ slug }) => slug)).size).toBe(111);
    expect(qrCodeSymbologies.length + barcodeSymbologies.length).toBe(111);
  });

  it("renders the canonical value for every registered symbology", () => {
    for (const symbology of codeSymbologies) {
      const output = generateCodeImage({
        includeText: false,
        padding: 2,
        scale: 1,
        symbology: symbology.bcid,
        text: symbology.exampleText,
      });
      expect(output.bcid, symbology.bcid).toBe(symbology.bcid);
      expect(output.svg, symbology.bcid).toMatch(/^<svg\b/u);
      expect(output.width, symbology.bcid).toBeGreaterThan(0);
      expect(output.height, symbology.bcid).toBeGreaterThan(0);
    }
  });

  it("rejects unsupported symbologies and malformed colors", () => {
    expect(() =>
      generateCodeImage({ symbology: "unknown", text: "123" }),
    ).toThrowError(/Unsupported code symbology/u);
    expect(() =>
      generateCodeImage({
        foregroundColor: "url(javascript:alert(1))",
        symbology: "qrcode",
        text: "safe",
      }),
    ).toThrowError(/six-digit hexadecimal/u);
  });
});

describe("QR application payload builders", () => {
  it("builds URL, Wi-Fi, communication, and location payloads", () => {
    expect(buildUrlQrPayload("https://tool.io/poll/abc")).toBe(
      "https://tool.io/poll/abc",
    );
    expect(
      buildWifiQrPayload({
        authentication: "WPA",
        password: "a;b",
        ssid: "Tool;IO",
      }),
    ).toBe("WIFI:T:WPA;S:Tool\\;IO;P:a\\;b;H:false;;");
    expect(buildPhoneQrPayload("+49 30 1234")).toBe("tel:+49 30 1234");
    expect(buildSmsQrPayload({ message: "Join us", number: "+123" })).toBe(
      "sms:+123?body=Join%20us",
    );
    expect(buildLocationQrPayload({ latitude: 52.52, longitude: 13.405 })).toBe(
      "geo:52.52,13.405",
    );
  });

  it("builds contact, email, calendar, and OTP payloads", () => {
    expect(
      buildContactQrPayload({ email: "hello@tool.io", name: "Tool.io" }),
    ).toContain("FN:Tool.io\r\nEMAIL:hello@tool.io");
    expect(
      buildEmailQrPayload({
        address: "hello@tool.io",
        subject: "Hello world",
      }),
    ).toBe("mailto:hello@tool.io?subject=Hello%20world");
    expect(
      buildCalendarQrPayload({
        end: "2026-09-23T11:00:00Z",
        start: "2026-09-23T10:00:00Z",
        title: "Tool.io demo",
      }),
    ).toContain("DTSTART:20260923T100000Z");
    expect(
      buildOtpQrPayload({
        account: "user@example.com",
        issuer: "Tool.io",
        secret: "JBSWY3DPEHPK3PXP",
      }),
    ).toBe(
      "otpauth://totp/Tool.io%3Auser%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Tool.io&digits=6&period=30",
    );
  });
});
