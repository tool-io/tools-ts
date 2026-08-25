import { describe, expect, it } from "vitest";
import {
  gelatinSilicaDoseExample,
  gelatinSilicaDoseTool,
  runGelatinSilicaDose,
} from "./tool.js";

describe("gelatinSilicaDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runGelatinSilicaDose(gelatinSilicaDoseExample.input)).toEqual({
      ok: true,
      output: gelatinSilicaDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(gelatinSilicaDoseExample))).toEqual(
      gelatinSilicaDoseExample,
    );
    expect(gelatinSilicaDoseTool.contractVersion).toBe(1);
    expect(gelatinSilicaDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runGelatinSilicaDose(null).ok).toBe(false);
    expect(
      runGelatinSilicaDose({
        ...gelatinSilicaDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
