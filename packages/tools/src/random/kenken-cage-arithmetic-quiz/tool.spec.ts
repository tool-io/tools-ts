import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateKenkenCageArithmeticQuiz as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("retains both order-independent difference replacements", () => {
    expect(
      calculate(
        { gridOrder: 5, cellCount: 2, operation: "difference" },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: { cells: [0, 2], target: 1, hiddenIndex: 0 },
        answer: { values: [1, 2], replacementValues: [1, 3] },
      },
    });
  });
  it("preserves noninteger quotient precision and supports product, sum, and single cages", () => {
    expect(
      calculate({
        gridOrder: 5,
        cellCount: 2,
        operation: "quotient",
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: { target: 1.3333333333333333 },
        answer: { values: [4, 3], replacementValues: [3] },
      },
    });
    expect(
      calculate({ gridOrder: 6, cellCount: 3, operation: "sum", seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: { target: 13 },
        answer: { values: [4, 3, 6], replacementValues: [6] },
      },
    });
    expect(
      calculate({ gridOrder: 6, cellCount: 1, operation: "single", seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: { cells: [0], target: 4 },
        answer: { replacementValues: [4] },
      },
    });
  });
  it("rejects incompatible arity, impossible positive differences, and resource excess", () => {
    expect(
      calculate({ gridOrder: 6, cellCount: 3, operation: "difference" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "cellCount", code: "operation_arity" }] },
    });
    expect(
      calculate({ gridOrder: 1, cellCount: 2, operation: "difference" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "gridOrder", code: "infeasible_operation" }] },
    });
    expect(tool.execute({ ...example.input, cellCount: 9 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "cellCount", code: "invalid_field" }] },
    });
  });
});
