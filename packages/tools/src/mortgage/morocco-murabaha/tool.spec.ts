import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Murabaha scenario", () => {
  it("uses a one-time markup", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
