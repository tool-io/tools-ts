import { describe, expect, it } from "vitest";
import { example, runIpv4ToInteger } from "./tool.js";

describe("network/ipv4-to-integer", () => {
  it("executes its canonical example", () => {
    expect(runIpv4ToInteger(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects out-of-range octets", () => {
    expect(runIpv4ToInteger({ address: "192.168.1.256" })).toMatchObject({
      ok: false,
    });
  });
});
