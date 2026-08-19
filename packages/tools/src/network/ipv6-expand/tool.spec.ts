import { describe, expect, it } from "vitest";
import { ipv6ExpandExample, runIpv6Expand } from "./tool.js";

describe("ipv6 address expander", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIpv6Expand(ipv6ExpandExample.input)).toEqual({
      ok: true,
      output: ipv6ExpandExample.output,
    });
  });

  it("expands loopback, all zeros, and embedded IPv4", () => {
    expect(runIpv6Expand({ address: "::1" })).toEqual({
      ok: true,
      output: { address: "0000:0000:0000:0000:0000:0000:0000:0001" },
    });
    expect(runIpv6Expand({ address: "::" })).toEqual({
      ok: true,
      output: { address: "0000:0000:0000:0000:0000:0000:0000:0000" },
    });
    expect(runIpv6Expand({ address: "::ffff:192.168.1.1" })).toEqual({
      ok: true,
      output: {
        address: "0000:0000:0000:0000:0000:ffff:c0a8:0101",
      },
    });
  });

  it("normalizes case and leading zeros", () => {
    expect(runIpv6Expand({ address: "FE80:0:0:0:0:0:0:A" })).toEqual({
      ok: true,
      output: { address: "fe80:0000:0000:0000:0000:0000:0000:000a" },
    });
  });

  it("rejects malformed addresses through execution", () => {
    for (const address of [
      "1::2::3",
      "12345::",
      "2001:db8:::1",
      "::ffff:999.1.1.1",
      "fe80::1%eth0",
    ])
      expect(runIpv6Expand({ address }).ok).toBe(false);
  });
});
