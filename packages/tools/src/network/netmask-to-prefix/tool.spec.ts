import { describe, expect, it } from "vitest";
import { example, runNetmaskToPrefix } from "./tool.js";

describe("network/netmask-to-prefix", () => {
  it("executes its canonical example", () => {
    expect(runNetmaskToPrefix(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects discontinuous masks", () => {
    expect(runNetmaskToPrefix({ netmask: "255.0.255.0" })).toMatchObject({
      ok: false,
    });
  });
});
