import { describe, expect, it } from "vitest";
import { convertOklchToHex, oklchToHexExample, runOklchToHex } from "./tool.js";

describe("OKLCH to HEX Converter", () => {
  it("converts the canonical example", () =>
    expect(convertOklchToHex(oklchToHexExample.input)).toEqual(
      oklchToHexExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runOklchToHex(oklchToHexExample.input)).toEqual({
      ok: true,
      output: oklchToHexExample.output,
    }));
});
