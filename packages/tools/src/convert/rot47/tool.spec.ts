import { describe, expect, it } from "vitest";
import { runRot47 } from "./tool.js";
describe("rot47 cipher", () => {
  it("is self-inverse", () => {
    const r1 = runRot47({ text: "Hello World!" });
    if (!r1.ok) throw new Error("fail");
    const r2 = runRot47({ text: r1.output.result });
    if (!r2.ok) throw new Error("fail");
    expect(r2.output.result).toBe("Hello World!");
  });
  it("leaves spaces unchanged", () => {
    const r = runRot47({ text: "a b" });
    if (!r.ok) throw new Error("fail");
    expect(r.output.result).toContain(" ");
  });
});
