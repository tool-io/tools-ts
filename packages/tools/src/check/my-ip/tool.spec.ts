import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { calculateMyIp, myIpExample, myIpTool } from "./tool.js";

describe("What Is My IP Address?", () => {
  it("publishes a valid remote capability contract", () => {
    expect(validateToolContract(myIpTool)).toEqual([]);
    expect(myIpTool.execution).toEqual({
      capabilities: [
        { id: "network/public-ip", required: true, schemaVersion: 1 },
      ],
      kind: "remote",
    });
  });

  it("executes the declared observation example", () => {
    expect(calculateMyIp(myIpExample.input)).toEqual({
      ok: true,
      output: myIpExample.output,
    });
  });

  it("normalizes separate IPv4 and IPv6 observations", () => {
    expect(
      calculateMyIp({
        ipv4Address: "8.8.8.8",
        ipv6Address: "2606:4700:4700:0:0:0:0:1111",
        observedAt: "2026-08-31T12:00:00Z",
        provider: " tool.io web ",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        ipv4Address: "8.8.8.8",
        ipv6Address: "2606:4700:4700::1111",
        provider: "tool.io web",
      },
    });
  });

  it("accepts a connection with only one available address family", () => {
    expect(
      calculateMyIp({
        ipv4Address: "8.8.8.8",
        ipv6Address: null,
        observedAt: "2026-08-31T12:00:00Z",
        provider: "tool.io web",
      }),
    ).toMatchObject({
      ok: true,
      output: { ipv4Address: "8.8.8.8", ipv6Address: null },
    });
  });

  it.each([
    null,
    {},
    {
      ipv4Address: "invalid",
      ipv6Address: null,
      observedAt: "now",
      provider: "web",
    },
    {
      extra: true,
      ipv4Address: "8.8.8.8",
      ipv6Address: null,
      observedAt: "2026-08-31T12:00:00Z",
      provider: "web",
    },
    {
      ipv4Address: null,
      ipv6Address: null,
      observedAt: "2026-08-31T12:00:00Z",
      provider: "web",
    },
  ])("rejects an invalid observation", (input) => {
    expect(calculateMyIp(input).ok).toBe(false);
  });
});
