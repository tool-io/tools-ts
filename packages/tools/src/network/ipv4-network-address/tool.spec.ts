import { describe, expect, it } from "vitest";
import { ipv4NetworkAddressExample, runIpv4NetworkAddress } from "./tool.js";

describe("IPv4 Network Address Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIpv4NetworkAddress(ipv4NetworkAddressExample.input)).toEqual({
      ok: true,
      output: ipv4NetworkAddressExample.output,
    });
  });
  it("rejects noncontiguous masks", () => {
    expect(
      runIpv4NetworkAddress({
        ipAddress: "192.168.1.77",
        subnetMask: "255.0.255.0",
      }).ok,
    ).toBe(false);
  });
});
