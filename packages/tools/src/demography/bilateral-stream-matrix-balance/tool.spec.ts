import { describe, expect, it } from "vitest";
import {
  calculateBilateralStreamMatrixBalance,
  runBilateralStreamMatrixBalance,
  bilateralStreamMatrixBalanceExample,
} from "./tool.js";

describe("demography/bilateral-stream-matrix-balance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBilateralStreamMatrixBalance(
        bilateralStreamMatrixBalanceExample.input,
      ),
    ).toEqual({ ok: true, output: bilateralStreamMatrixBalanceExample.output });
  });

  it("nets to zero across a closed system", () => {
    const result = calculateBilateralStreamMatrixBalance({
      streams: [
        [0, 7],
        [7, 0],
      ],
    });
    const sum = result.netInflow.reduce((total, value) => total + value, 0);
    expect(sum).toBe(0);
    expect(result.totalMigrants).toBe(14);
  });

  it("rejects non-square or negative matrices", () => {
    expect(runBilateralStreamMatrixBalance({ streams: [[1, 2]] }).ok).toBe(
      false,
    );
    expect(
      runBilateralStreamMatrixBalance({
        streams: [
          [-1, 2],
          [3, 4],
        ],
      }).ok,
    ).toBe(false);
  });
});
