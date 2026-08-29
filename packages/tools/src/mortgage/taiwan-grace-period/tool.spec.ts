import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Taiwan grace period", () => {
  it("defers principal", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
