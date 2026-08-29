import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("unsigned varint encoder", () => {
  it("encodes 300", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects values beyond uint64", () =>
    expect(tool.execute({ value: "18446744073709551616" }).ok).toBe(false));
});
