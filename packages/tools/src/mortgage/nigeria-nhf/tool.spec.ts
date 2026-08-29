import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("mortgage/nigeria-nhf", () => {
  it("calculates a zero-rate reference", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
});
