import { describe, expect, it } from "vitest";
import { runSubtractTwoNumbers } from "./tool.js";

describe("Subtract Two Numbers Calculator", () => {
  it("subtracts the second value from the first", () =>
    expect(runSubtractTwoNumbers({ minuend: 4, subtrahend: 9 })).toEqual({
      ok: true,
      output: { difference: -5 },
    }));

  it("rejects invalid input", () =>
    expect(runSubtractTwoNumbers({ minuend: "4", subtrahend: 2 }).ok).toBe(
      false,
    ));
});
