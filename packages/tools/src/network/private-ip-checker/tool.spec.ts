import { describe, expect, it } from "vitest";
import { example, runPrivateIpChecker } from "./tool.js";

describe("network/private-ip-checker", () => {
  it("executes its canonical example", () => {
    expect(runPrivateIpChecker(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("distinguishes public addresses from malformed input", () => {
    expect(runPrivateIpChecker({ address: "8.8.8.8" })).toEqual({
      ok: true,
      output: { isPrivate: false },
    });
    expect(runPrivateIpChecker({ address: "not-an-address" })).toMatchObject({
      ok: false,
    });
  });
});
