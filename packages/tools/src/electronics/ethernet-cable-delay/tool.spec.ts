import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Ethernet Cable Propagation Delay", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, cableLengthM: null }).ok).toBe(
      false,
    ));
});
