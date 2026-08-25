import { describe, expect, it } from "vitest";
import {
  kmbsGramsPpmExample,
  kmbsGramsPpmTool,
  runKmbsGramsPpm,
} from "./tool.js";

describe("kmbsGramsPpmTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runKmbsGramsPpm(kmbsGramsPpmExample.input)).toEqual({
      ok: true,
      output: kmbsGramsPpmExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(kmbsGramsPpmExample))).toEqual(
      kmbsGramsPpmExample,
    );
    expect(kmbsGramsPpmTool.contractVersion).toBe(1);
    expect(kmbsGramsPpmTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runKmbsGramsPpm(null).ok).toBe(false);
    expect(
      runKmbsGramsPpm({ ...kmbsGramsPpmExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});

describe("kmbs grams ppm purity effect", () => {
  it("uses more product at lower SO2 content", () => {
    const pure = runKmbsGramsPpm({
      kmbsSo2ContentPercent: 100,
      targetIncreaseMgPerL: 30,
      volumeLiters: 200,
    });
    expect(pure.ok && pure.output.kmbsGrams).toBe(6);
  });

  it("rejects zero-strength product", () => {
    expect(
      runKmbsGramsPpm({
        kmbsSo2ContentPercent: 0,
        targetIncreaseMgPerL: 30,
        volumeLiters: 200,
      }).ok,
    ).toBe(false);
  });
});
