import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Uruguay UI projection", () => {
  it("keeps the UI payment fixed", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
