import { describe, expect, it } from "vitest";
import {
  oechsleToBrixExample,
  oechsleToBrixTool,
  runOechsleToBrix,
} from "./tool.js";

describe("oechsleToBrixTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runOechsleToBrix(oechsleToBrixExample.input)).toEqual({
      ok: true,
      output: oechsleToBrixExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(oechsleToBrixExample))).toEqual(
      oechsleToBrixExample,
    );
    expect(oechsleToBrixTool.contractVersion).toBe(1);
    expect(oechsleToBrixTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runOechsleToBrix(null).ok).toBe(false);
    expect(
      runOechsleToBrix({ ...oechsleToBrixExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
