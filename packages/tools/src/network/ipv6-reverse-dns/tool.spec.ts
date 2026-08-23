import { describe, expect, it } from "vitest";
import { runIpv6ReverseDns, ipv6ReverseDnsExample } from "./tool.js";
describe("ipv6 reverse dns name builder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIpv6ReverseDns(ipv6ReverseDnsExample.input)).toEqual({
      ok: true,
      output: ipv6ReverseDnsExample.output,
    });
  });
  it("rejects double compression", () => {
    expect(runIpv6ReverseDns({ ipv6: "1::2::3" }).ok).toBe(false);
  });
});
