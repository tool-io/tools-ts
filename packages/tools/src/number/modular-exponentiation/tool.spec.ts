import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("number/modular-exponentiation", () => {
  it("matches the reference", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
});
