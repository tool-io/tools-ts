import { describe, expect, it } from "vitest";
import {
  twoWineAbvBlendExample,
  twoWineAbvBlendTool,
  runTwoWineAbvBlend,
} from "./tool.js";

describe("twoWineAbvBlendTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runTwoWineAbvBlend(twoWineAbvBlendExample.input)).toEqual({
      ok: true,
      output: twoWineAbvBlendExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(twoWineAbvBlendExample))).toEqual(
      twoWineAbvBlendExample,
    );
    expect(twoWineAbvBlendTool.contractVersion).toBe(1);
    expect(twoWineAbvBlendTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTwoWineAbvBlend(null).ok).toBe(false);
    expect(
      runTwoWineAbvBlend({
        ...twoWineAbvBlendExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
