import { describe, expect, it } from "vitest";
import {
  baumeToBrixExample,
  baumeToBrixTool,
  runBaumeToBrix,
} from "./tool.js";

describe("baumeToBrixTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBaumeToBrix(baumeToBrixExample.input)).toEqual({
      ok: true,
      output: baumeToBrixExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(baumeToBrixExample))).toEqual(baumeToBrixExample);
    expect(baumeToBrixTool.contractVersion).toBe(1);
    expect(baumeToBrixTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBaumeToBrix(null).ok).toBe(false);
    expect(
      runBaumeToBrix({ ...baumeToBrixExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
