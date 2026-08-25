import { describe, expect, it } from "vitest";
import {
  decantingTimeStyleExample,
  decantingTimeStyleTool,
  runDecantingTimeStyle,
} from "./tool.js";

describe("decantingTimeStyleTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runDecantingTimeStyle(decantingTimeStyleExample.input)).toEqual({
      ok: true,
      output: decantingTimeStyleExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(decantingTimeStyleExample))).toEqual(
      decantingTimeStyleExample,
    );
    expect(decantingTimeStyleTool.contractVersion).toBe(1);
    expect(decantingTimeStyleTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDecantingTimeStyle(null).ok).toBe(false);
    expect(
      runDecantingTimeStyle({
        ...decantingTimeStyleExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses caller-supplied service guidance", () => {
    expect(
      runDecantingTimeStyle({
        matureRedMinutes: 20,
        whiteMinutes: 5,
        wineCondition: "mature_red",
        youngRedMinutes: 90,
      }),
    ).toEqual({ ok: true, output: { decantingMinutes: 20 } });
  });
});
