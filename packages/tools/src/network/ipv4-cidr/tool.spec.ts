import { describe, expect, it } from "vitest";
import { example, runIpv4Cidr } from "./tool.js";

describe("network/ipv4-cidr", () => {
  it("executes its canonical example", () => {
    expect(runIpv4Cidr(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("counts both addresses in an RFC 3021 point-to-point /31", () => {
    expect(runIpv4Cidr({ address: "192.0.2.10", prefix: 31 })).toEqual({
      ok: true,
      output: {
        broadcastAddress: "192.0.2.11",
        firstHost: "192.0.2.10",
        lastHost: "192.0.2.11",
        networkAddress: "192.0.2.10",
        totalHosts: 2,
      },
    });
  });
});
