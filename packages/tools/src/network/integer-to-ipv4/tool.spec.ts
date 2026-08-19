import { describe, expect, it } from "vitest";
import { example, runIntegerToIpv4 } from "./tool.js";

describe("network/integer-to-ipv4", () => {
  it("executes its canonical example", () => {
    expect(runIntegerToIpv4(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("converts the unsigned 32-bit boundaries", () => {
    expect(runIntegerToIpv4({ integer: 0 })).toEqual({
      ok: true,
      output: { address: "0.0.0.0" },
    });
    expect(runIntegerToIpv4({ integer: 4294967295 })).toEqual({
      ok: true,
      output: { address: "255.255.255.255" },
    });
  });
});
