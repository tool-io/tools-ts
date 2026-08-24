import { describe, expect, it } from "vitest";
import {
  runThornYoghWynnCounter,
  thornYoghWynnCounterExample,
} from "./tool.js";

describe("thorn-yogh-wynn-counter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runThornYoghWynnCounter(thornYoghWynnCounterExample.input)).toEqual({
      ok: true,
      output: thornYoghWynnCounterExample.output,
    });
  });

  it("counts uppercase thorn too", () => {
    const result = runThornYoghWynnCounter({ text: "\u00DE\u00DE\u00DE" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.thornCount as number).toBe(3);
  });

  it("rejects empty text", () => {
    expect(runThornYoghWynnCounter({ text: "" }).ok).toBe(false);
  });

  it("uses Unicode code points for the per-character rate", () => {
    const result = runThornYoghWynnCounter({ text: "😀þ" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.specialPerThousandCharacters).toBe(500);
  });
});
