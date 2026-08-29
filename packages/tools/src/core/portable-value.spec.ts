import { describe, expect, it } from "vitest";
import {
  validatePortableDate,
  validatePortableDateTime,
  validatePortableDocument,
  validatePortableFile,
  validatePortableQuantity,
  validatePortableStructuredValue,
} from "./portable-value.js";

describe("portable structured values", () => {
  it("validates finite quantities with open unit identifiers", () => {
    expect(
      validatePortableQuantity({
        kind: "tool.io/quantity",
        semanticType: "length",
        uncertainty: 0.02,
        unit: "historical/rome/pes",
        value: 3.5,
        version: 1,
      }),
    ).toEqual([]);
    expect(
      validatePortableQuantity({
        kind: "tool.io/quantity",
        unit: "m",
        value: Number.POSITIVE_INFINITY,
        version: 1,
      }).map(({ code }) => code),
    ).toContain("quantity_value_invalid");
  });

  it("rejects impossible dates and date-times without explicit offsets", () => {
    expect(
      validatePortableDate({
        calendar: "gregory",
        kind: "tool.io/date",
        value: "2024-02-29",
        version: 1,
      }),
    ).toEqual([]);
    expect(
      validatePortableDate({
        calendar: "gregory",
        kind: "tool.io/date",
        value: "2025-02-29",
        version: 1,
      }).map(({ code }) => code),
    ).toContain("date_value_invalid");
    expect(
      validatePortableDateTime({
        kind: "tool.io/date-time",
        value: "2026-09-12T14:30:00",
        version: 1,
      }).map(({ code }) => code),
    ).toContain("date_time_value_invalid");
  });

  it("validates embedded and referenced files", () => {
    expect(
      validatePortableFile({
        kind: "tool.io/file",
        mediaType: "text/plain;charset=utf-8",
        name: "notes.txt",
        sizeBytes: 5,
        source: { data: "aGVsbG8=", kind: "base64" },
        version: 1,
      }),
    ).toEqual([]);
    expect(
      validatePortableFile({
        kind: "tool.io/file",
        mediaType: "application/json",
        name: "data.json",
        sha256: "not-a-digest",
        sizeBytes: 0,
        source: { kind: "uri", uri: "https://example.test/data.json" },
        version: 1,
      }).map(({ code }) => code),
    ).toContain("file_sha256_invalid");
  });

  it("validates text and file-backed documents", () => {
    const document = {
      content: { kind: "text", text: "# Report" },
      kind: "tool.io/document",
      language: "en-US",
      mediaType: "text/markdown",
      title: "Report",
      version: 1,
    } as const;
    expect(validatePortableDocument(document)).toEqual([]);
    expect(validatePortableStructuredValue(document)).toEqual([]);
    expect(
      validatePortableDocument({ ...document, unexpected: true }).map(
        ({ code }) => code,
      ),
    ).toContain("unknown_property");
  });
});
