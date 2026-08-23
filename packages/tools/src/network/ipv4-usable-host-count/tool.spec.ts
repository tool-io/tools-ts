import { describe, expect, it } from "vitest";
import { ipv4UsableHostCountExample, runIpv4UsableHostCount } from "./tool.js";

describe("IPv4 Usable Host Count Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIpv4UsableHostCount(ipv4UsableHostCountExample.input)).toEqual({
      ok: true,
      output: ipv4UsableHostCountExample.output,
    });
  });
  it("supports point-to-point prefixes", () => {
    const result = runIpv4UsableHostCount({ prefix: 31 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.usableHosts).toBe(2);
  });
});
