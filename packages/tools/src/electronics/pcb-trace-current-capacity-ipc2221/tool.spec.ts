import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";
describe("IPC-2221 trace estimate", () => {
  it("uses the external-layer coefficient", () =>
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects unknown layer", () =>
    expect(tool.execute({ ...example.input, layer: "buried" }).ok).toBe(false));
});
