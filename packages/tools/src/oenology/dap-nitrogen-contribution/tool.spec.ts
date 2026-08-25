import { describe, expect, it } from "vitest";
import {
  dapNitrogenContributionExample,
  dapNitrogenContributionTool,
  runDapNitrogenContribution,
} from "./tool.js";

describe("dapNitrogenContributionTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runDapNitrogenContribution(dapNitrogenContributionExample.input),
    ).toEqual({
      ok: true,
      output: dapNitrogenContributionExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(dapNitrogenContributionExample))).toEqual(
      dapNitrogenContributionExample,
    );
    expect(dapNitrogenContributionTool.contractVersion).toBe(1);
    expect(dapNitrogenContributionTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDapNitrogenContribution(null).ok).toBe(false);
    expect(
      runDapNitrogenContribution({
        ...dapNitrogenContributionExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
