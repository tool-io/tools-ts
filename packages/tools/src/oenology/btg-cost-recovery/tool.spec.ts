import { describe, expect, it } from "vitest";
import {
  btgCostRecoveryExample,
  btgCostRecoveryTool,
  runBtgCostRecovery,
} from "./tool.js";

describe("btgCostRecoveryTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBtgCostRecovery(btgCostRecoveryExample.input)).toEqual({
      ok: true,
      output: btgCostRecoveryExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(btgCostRecoveryExample))).toEqual(btgCostRecoveryExample);
    expect(btgCostRecoveryTool.contractVersion).toBe(1);
    expect(btgCostRecoveryTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBtgCostRecovery(null).ok).toBe(false);
    expect(
      runBtgCostRecovery({ ...btgCostRecoveryExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
