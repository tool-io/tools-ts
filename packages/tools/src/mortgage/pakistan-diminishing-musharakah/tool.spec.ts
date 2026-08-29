import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Diminishing Musharakah", () => {
  it("declines as bank share falls", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
});
