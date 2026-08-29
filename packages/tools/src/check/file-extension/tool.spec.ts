import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("file extension", () => {
  it("compares the final suffix", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
