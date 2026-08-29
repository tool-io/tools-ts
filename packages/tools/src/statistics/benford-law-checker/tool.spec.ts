import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("Benford counts", () => {
  it("counts first digits", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
