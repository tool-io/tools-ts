import { describe, expect, it } from "vitest";
import {
  polymericPigmentIndexExample,
  polymericPigmentIndexTool,
  runPolymericPigmentIndex,
} from "./tool.js";

describe("polymericPigmentIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runPolymericPigmentIndex(polymericPigmentIndexExample.input),
    ).toEqual({
      ok: true,
      output: polymericPigmentIndexExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(polymericPigmentIndexExample))).toEqual(
      polymericPigmentIndexExample,
    );
    expect(polymericPigmentIndexTool.contractVersion).toBe(1);
    expect(polymericPigmentIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPolymericPigmentIndex(null).ok).toBe(false);
    expect(
      runPolymericPigmentIndex({
        ...polymericPigmentIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
