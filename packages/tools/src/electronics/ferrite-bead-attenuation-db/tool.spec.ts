import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("Ferrite Bead Insertion Loss", () => {
  it("matches the worked example", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects an invalid input", () =>
    expect(tool.execute({ ...example.input, beadResistanceOhm: null }).ok).toBe(
      false,
    ));
});
