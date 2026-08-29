import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("SPI Frequency from Trace Delay", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, traceLengthM: null }).ok).toBe(
      false,
    ));
});
