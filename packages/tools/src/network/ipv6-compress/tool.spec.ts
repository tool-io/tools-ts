import { describe, expect, it } from "vitest";
import {
  calculateIpv6Compress,
  ipv6CompressExample,
  runIpv6Compress,
} from "./tool.js";

describe("ipv6 address compressor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIpv6Compress(ipv6CompressExample.input)).toEqual({
      ok: true,
      output: ipv6CompressExample.output,
    });
  });

  it("collapses the leftmost longest zero run only when it spans two groups", () => {
    expect(runIpv6Compress({ address: "0:0:1:0:0:0:0:1" })).toEqual({
      ok: true,
      output: { address: "0:0:1::1" },
    });
    expect(
      runIpv6Compress({
        address: "fe80:0000:0000:0000:0000:0000:0000:0000",
      }),
    ).toEqual({ ok: true, output: { address: "fe80::" } });
  });

  it("keeps single zero groups literal", () => {
    expect(runIpv6Compress({ address: "2001:db8:1::a" })).toEqual({
      ok: true,
      output: { address: "2001:db8:1::a" },
    });
    expect(
      runIpv6Compress({ address: "0000:0001:0002:0003:0004:0005:0006:0007" }),
    ).toEqual({ ok: true, output: { address: "0:1:2:3:4:5:6:7" } });
  });

  it("normalizes embedded IPv4 tails to hex groups", () => {
    expect(runIpv6Compress({ address: "::ffff:192.168.1.1" })).toEqual({
      ok: true,
      output: { address: "::ffff:c0a8:101" },
    });
  });

  it("round-trips with the expander through execution", async () => {
    const { runIpv6Expand } = await import("../ipv6-expand/tool.js");
    const compressed = runIpv6Compress(ipv6CompressExample.input);
    if (!compressed.ok) throw new Error("expected success");
    expect(runIpv6Expand({ address: compressed.output.address })).toEqual({
      ok: true,
      output: {
        address: "2001:0db8:0000:0000:0000:ff00:0042:8329",
      },
    });
  });
});
