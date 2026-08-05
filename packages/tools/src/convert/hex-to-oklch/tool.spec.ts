import { describe, expect, it } from "vitest";
import { convertHexToOklch, hexToOklchExample, runHexToOklch } from "./tool.js";

describe("HEX to OKLCH Converter", () => {
  it("converts the canonical example", () =>
    expect(convertHexToOklch(hexToOklchExample.input)).toEqual(
      hexToOklchExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runHexToOklch(hexToOklchExample.input)).toEqual({
      ok: true,
      output: hexToOklchExample.output,
    }));
});
