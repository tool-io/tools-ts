import { describe, expect, it } from "vitest";
import {
  calculateIpv6Subnet,
  ipv6SubnetExample,
  runIpv6Subnet,
} from "./tool.js";

describe("network/ipv6-subnet", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIpv6Subnet(ipv6SubnetExample.input)).toEqual({
      ok: true,
      output: ipv6SubnetExample.output,
    });
  });

  it("includes both /127 addresses", () => {
    const result = runIpv6Subnet({ address: "2001:db8::5", prefixLength: 127 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.networkAddress).toBe(
      "2001:0db8:0000:0000:0000:0000:0000:0004",
    );
    expect(result.output.firstHost).toBe(
      "2001:0db8:0000:0000:0000:0000:0000:0004",
    );
    expect(result.output.lastHost).toBe(
      "2001:0db8:0000:0000:0000:0000:0000:0005",
    );
    expect(result.output.hostCountText).toBe("2");
  });

  it("treats a /128 as its own single address", () => {
    const result = runIpv6Subnet({ address: "::1", prefixLength: 128 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.firstHost).toBe(
      "0000:0000:0000:0000:0000:0000:0000:0001",
    );
    expect(result.output.lastHost).toBe(
      "0000:0000:0000:0000:0000:0000:0000:0001",
    );
    expect(result.output.hostCountText).toBe("1");
  });

  it("reports the exact address count beyond safe integer range", () => {
    const result = runIpv6Subnet({ address: "::", prefixLength: 0 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.hostCountText).toBe(
      "340282366920938463463374607431768211456",
    );
    expect(result.output.firstHost).toBe(
      "0000:0000:0000:0000:0000:0000:0000:0000",
    );
    expect(result.output.lastHost).toBe(
      "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
    );
  });

  it("rejects out-of-range prefix lengths", () => {
    expect(runIpv6Subnet({ address: "::1", prefixLength: 129 }).ok).toBe(false);
  });

  it("rejects malformed addresses with structured errors", () => {
    expect(runIpv6Subnet({ address: "nope", prefixLength: 64 }).ok).toBe(false);
  });
});
