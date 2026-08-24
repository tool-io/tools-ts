import { describe, expect, it } from "vitest";
import { runUstavPoluustavDater, ustavPoluustavDaterExample } from "./tool.js";

describe("ustav-poluustav-dater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUstavPoluustavDater(ustavPoluustavDaterExample.input)).toEqual({
      ok: true,
      output: ustavPoluustavDaterExample.output,
    });
  });

  it("flags ninth-century poluustav as anachronistic", () => {
    const result = runUstavPoluustavDater({ century: 9, hand: "poluustav" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.plausibility as string).toBe("anachronistic");
  });

  it("marks fifteenth-century ustav as rare continuation", () => {
    const result = runUstavPoluustavDater({ century: 15, hand: "ustav" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.plausibility as string).toBe("rare");
  });

  it("rejects non-positive centuries", () => {
    expect(runUstavPoluustavDater({ century: -1, hand: "ustav" }).ok).toBe(
      false,
    );
  });
});
