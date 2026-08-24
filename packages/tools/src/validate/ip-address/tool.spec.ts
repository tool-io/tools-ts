import { describe, expect, it } from "vitest";
import {
  ipAddressExample,
  runIpAddressValidation,
  validateIpAddress,
} from "./tool.js";

describe("IP Address Validator", () => {
  it("executes the declared example", () => {
    expect(runIpAddressValidation(ipAddressExample.input)).toEqual({
      ok: true,
      output: ipAddressExample.output,
    });
  });

  it.each([
    ["8.8.8.8", "8.8.8.8", "IPv4", "global", true],
    ["192.168.1.1", "192.168.1.1", "IPv4", "private", false],
    ["127.0.0.1", "127.0.0.1", "IPv4", "loopback", false],
    ["[2001:DB8::0001]", "2001:db8::1", "IPv6", "documentation", false],
    ["::1", "::1", "IPv6", "loopback", false],
    ["::ffff:192.0.2.128", "::ffff:c000:280", "IPv6", "ipv4-mapped", false],
    ["2606:4700:4700::1111", "2606:4700:4700::1111", "IPv6", "global", true],
  ])("validates %s", (input, normalized, version, scope, isPublic) => {
    expect(validateIpAddress(input)).toEqual({
      isPublic,
      normalized,
      scope,
      version,
    });
  });

  it.each(["", "01.2.3.4", "256.0.0.1", "2001:::1", "hello"])(
    "rejects %s",
    (input) => expect(validateIpAddress(input)).toBeNull(),
  );
});
