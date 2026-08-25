import { describe, expect, it } from "vitest";
import {
  leesStirringFrequencyExample,
  leesStirringFrequencyTool,
  runLeesStirringFrequency,
} from "./tool.js";

describe("leesStirringFrequencyTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runLeesStirringFrequency(leesStirringFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: leesStirringFrequencyExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(leesStirringFrequencyExample))).toEqual(
      leesStirringFrequencyExample,
    );
    expect(leesStirringFrequencyTool.contractVersion).toBe(1);
    expect(leesStirringFrequencyTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runLeesStirringFrequency(null).ok).toBe(false);
    expect(
      runLeesStirringFrequency({
        ...leesStirringFrequencyExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
