import { describe, expect, it } from "vitest";
import { runDigitFrequency } from "./tool.js";
describe("digit frequency counter", () => {
  it("counts digits in 122333", () => {
    const r = runDigitFrequency({ n: 122333 });
    if (!r.ok) throw new Error("expected success");
    expect((r.output as any).frequency).toEqual({ "1": 1, "2": 2, "3": 3 });
  });
});
