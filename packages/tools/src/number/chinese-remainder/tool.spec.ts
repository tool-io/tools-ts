import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("number/chinese-remainder", () => {
  it("matches the reference", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
});
