import { describe, expect, it } from "vitest";
import {
  ipv4BroadcastAddressExample,
  runIpv4BroadcastAddress,
} from "./tool.js";

describe("IPv4 Broadcast Address Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIpv4BroadcastAddress(ipv4BroadcastAddressExample.input)).toEqual({
      ok: true,
      output: ipv4BroadcastAddressExample.output,
    });
  });
  it("rejects malformed addresses", () => {
    expect(
      runIpv4BroadcastAddress({
        ipAddress: "192.168.1.999",
        subnetMask: "255.255.255.0",
      }).ok,
    ).toBe(false);
  });
});
