import { describe, expect, it } from "vitest";
import { validateToolContract } from "../core/contract.js";

const tools = {
  "network/ipv4-to-integer": await import("./ipv4-to-integer/tool.js"),
  "network/integer-to-ipv4": await import("./integer-to-ipv4/tool.js"),
  "network/prefix-to-netmask": await import("./prefix-to-netmask/tool.js"),
  "network/netmask-to-prefix": await import("./netmask-to-prefix/tool.js"),
  "network/private-ip-checker": await import("./private-ip-checker/tool.js"),
  "network/ipv4-cidr": await import("./ipv4-cidr/tool.js"),
} as const;

describe("IPv4 network family", () => {
  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      const result = tool.execute(module.example.input);
      expect(result).toEqual({ ok: true, output: module.example.output });
    });
  }

  it("round-trips addresses through integers", async () => {
    const toInt = tools["network/ipv4-to-integer"].default;
    const toAddr = tools["network/integer-to-ipv4"].default;
    for (const address of ["0.0.0.0", "10.0.0.5", "255.255.255.255"]) {
      const converted = toInt.execute({ address }) as unknown as {
        output: { integer: number };
      };
      expect(toAddr.execute({ integer: converted.output.integer })).toEqual({
        ok: true,
        output: { address },
      });
    }
  });

  it("matches prefix and netmask conversions", () => {
    expect(
      tools["network/netmask-to-prefix"].default.execute({
        netmask: "255.255.0.0",
      }),
    ).toEqual({ ok: true, output: { prefix: 16 } });
    expect(
      tools["network/prefix-to-netmask"].default.execute({ prefix: 8 }),
    ).toEqual({ ok: true, output: { netmask: "255.0.0.0" } });
    // Discontinuous masks are invalid.
    expect(
      tools["network/netmask-to-prefix"].default.execute({
        netmask: "255.0.255.0",
      }),
    ).toMatchObject({ ok: false });
  });

  it("classifies private ranges", () => {
    const check = tools["network/private-ip-checker"].default;
    for (const [address, expected] of [
      ["10.1.2.3", true],
      ["172.16.0.1", true],
      ["192.168.9.9", true],
      ["127.0.0.1", true],
      ["169.254.1.1", true],
      ["8.8.8.8", false],
      ["172.32.0.1", false],
    ] as const)
      expect(check.execute({ address })).toEqual({
        ok: true,
        output: { isPrivate: expected },
      });
  });

  it("computes slash-30 ranges and host capacity", () => {
    expect(
      tools["network/ipv4-cidr"].default.execute({
        address: "10.0.0.5",
        prefix: 30,
      }),
    ).toEqual({
      ok: true,
      output: {
        broadcastAddress: "10.0.0.7",
        firstHost: "10.0.0.5",
        lastHost: "10.0.0.6",
        networkAddress: "10.0.0.4",
        totalHosts: 2,
      },
    });
  });

  it("counts both addresses in an RFC 3021 slash-31 network", () => {
    expect(
      tools["network/ipv4-cidr"].default.execute({
        address: "192.0.2.10",
        prefix: 31,
      }),
    ).toMatchObject({ output: { totalHosts: 2 } });
  });
});
