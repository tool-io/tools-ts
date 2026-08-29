import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

describe("Gini coefficient", () => {
  it("matches a symmetric bimodal sample", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an undefined all-zero sample", () =>
    expect(tool.execute({ values: [0, 0] }).ok).toBe(false));
});
