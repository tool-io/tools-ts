import { describe, expect, it } from "vitest";
import {
  parseWatchSerialNumberComponents,
  runSerialNumberComponent,
  serialNumberComponentExample,
} from "./tool.js";

describe("watch serial-number format component parser", () => {
  it("reproduces the canonical three-component example", () => {
    expect(
      runSerialNumberComponent(serialNumberComponentExample.input),
    ).toEqual({
      ok: true,
      output: serialNumberComponentExample.output,
    });
  });

  it("parses a numeric-only serial", () => {
    expect(
      parseWatchSerialNumberComponents({ serialNumber: "12345678" }),
    ).toMatchObject({ componentCount: 1, prefix: "", suffix: "" });
  });

  it("normalizes surrounding whitespace and case", () => {
    expect(
      parseWatchSerialNumberComponents({ serialNumber: " xy987654 " }).prefix,
    ).toBe("XY");
  });

  it("rejects a numeric body shorter than four digits", () => {
    expect(
      runSerialNumberComponent({ serialNumber: "AB-123-C" }),
    ).toMatchObject({
      error: {
        issues: [{ code: "unsupported_serial_format", field: "serialNumber" }],
      },
      ok: false,
    });
  });

  it("rejects embedded separators", () => {
    expect(
      runSerialNumberComponent({ serialNumber: "AB/123456" }),
    ).toMatchObject({
      error: {
        issues: [{ code: "unsupported_serial_format", field: "serialNumber" }],
      },
      ok: false,
    });
  });
});
