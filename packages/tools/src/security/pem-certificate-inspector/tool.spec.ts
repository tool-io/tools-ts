import { describe, expect, it } from "vitest";
import {
  calculatePemCertificateInspector,
  pemCertificateInspectorExample,
  runPemCertificateInspector,
} from "./tool.js";

describe("security/pem-certificate-inspector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPemCertificateInspector(pemCertificateInspectorExample.input),
    ).toEqual({
      ok: true,
      output: pemCertificateInspectorExample.output,
    });
  });

  it("counts multiple blocks and RFC 1421 header lines in order", () => {
    const result = calculatePemCertificateInspector({
      pem: [
        "-----BEGIN CERTIFICATE-----",
        "dGVzdCBjZXJ0aWZpY2F0ZQ==",
        "-----END CERTIFICATE-----",
        "-----BEGIN RSA PRIVATE KEY-----",
        "Proc-Type: 4,ENCRYPTED",
        "DEK-Info: DES-EDE3-CBC,8C5F",
        "YWJj",
        "-----END RSA PRIVATE KEY-----",
      ].join("\n"),
    });
    expect(result.blockCount).toBe(2);
    expect(result.labels).toEqual(["CERTIFICATE", "RSA PRIVATE KEY"]);
    expect(result.decodedByteCounts).toEqual([16, 3]);
    expect(result.headerLineCount).toBe(2);
  });

  it("rejects text without any PEM armor", () => {
    const result = runPemCertificateInspector({ pem: "just some text" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("missing_pem_block");
  });

  it("rejects mismatched BEGIN and END labels", () => {
    const result = runPemCertificateInspector({
      pem: "-----BEGIN CERTIFICATE-----\nYWJj\n-----END PUBLIC KEY-----",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("malformed_pem");
  });

  it("rejects bodies that are not valid base64", () => {
    const result = runPemCertificateInspector({
      pem: "-----BEGIN CERTIFICATE-----\n!!!not base64!!!\n-----END CERTIFICATE-----",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("malformed_pem");
  });

  it("accepts wrapped multi-line base64 bodies", () => {
    const result = calculatePemCertificateInspector({
      pem: "-----BEGIN PUBLIC KEY-----\ndGVzdCBjZXJ0\naWZpY2F0ZQ==\n-----END PUBLIC KEY-----",
    });
    expect(result.decodedByteCounts).toEqual([16]);
    expect(result.labels).toEqual(["PUBLIC KEY"]);
  });
});
