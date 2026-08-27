import { describe, expect, it } from "vitest";
import {
  geologicalStrengthIndexGsiExample,
  runGeologicalStrengthIndexGsi,
} from "./tool.js";

describe("geological-strength-index-gsi", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGeologicalStrengthIndexGsi(geologicalStrengthIndexGsiExample.input),
    ).toEqual({
      ok: true,
      output: geologicalStrengthIndexGsiExample.output,
    });
  });

  it("maps RMR76 of 24 to the minimum valid GSI", () => {
    const result = runGeologicalStrengthIndexGsi({ rmr76: 24 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gsi as number).toBe(19);
  });

  it("rejects RMR76 values within the invalid range", () => {
    expect(runGeologicalStrengthIndexGsi({ rmr76: 23 }).ok).toBe(false);
  });
});
