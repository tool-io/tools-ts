import { describe, expect, it } from "vitest";
import { example, runPrefixToNetmask } from "./tool.js";

describe("network/prefix-to-netmask", () => {
  it("executes its canonical example", () => {
    expect(runPrefixToNetmask(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("supports the zero prefix", () => {
    expect(runPrefixToNetmask({ prefix: 0 })).toEqual({
      ok: true,
      output: { netmask: "0.0.0.0" },
    });
  });
});
