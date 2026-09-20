import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateBooleanAdderCircuitTrace as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("independently checks all half- and full-adder input combinations by integer arithmetic", () => {
    for (const mode of ["half", "full"] as const)
      for (let mask = 0; mask < (mode === "half" ? 4 : 8); mask += 1) {
        const bits = [Boolean(mask & 1), Boolean(mask & 2), Boolean(mask & 4)],
          draws = bits.map((bit) => (bit ? 0.9 : 0));
        let i = 0;
        const result = calculate(
          { mode, bitCount: 1, initialCarry: false },
          { random: () => draws[i++] ?? 0 },
        );
        if (!result.ok) throw new Error("Expected cell");
        const cell = result.output.steps[0],
          total =
            Number(bits[0]) +
            Number(bits[1]) +
            (mode === "full" ? Number(bits[2]) : 0);
        expect(Number(cell.sum) + 2 * Number(cell.carryOut)).toBe(total);
        expect(cell.carryIn).toBe(mode === "full" && bits[2]);
        expect(result.output.summary.rippleTotal).toBeNull();
      }
  });
  it("propagates ripple carry through all 32 bits with exact safe-integer totals", () => {
    const result = calculate(
      { mode: "ripple", bitCount: 32, initialCarry: true },
      { random: () => 0.99 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        summary: {
          leftValue: 4294967295,
          rightValue: 4294967295,
          sumValue: 4294967295,
          finalCarry: true,
          rippleTotal: 8589934591,
        },
      },
    });
    if (!result.ok) throw new Error("Expected ripple");
    expect(
      result.output.steps.every(
        (step) => step.carryIn && step.carryOut && step.sum,
      ),
    ).toBe(true);
    const independentDraws = [0.9, 0, 0.9, 0, 0, 0];
    let i = 0;
    const independent = calculate(
      { mode: "full", bitCount: 2, initialCarry: false },
      { random: () => independentDraws[i++] ?? 0 },
    );
    expect(independent).toMatchObject({
      ok: true,
      output: {
        steps: [
          { a: true, b: false, carryIn: true, sum: false, carryOut: true },
          { a: false, b: false, carryIn: false, sum: false, carryOut: false },
        ],
      },
    });
  });
  it("rejects unused initial carries and widths beyond the trace resource bound", () => {
    expect(
      calculate({ mode: "half", bitCount: 4, initialCarry: true }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "initialCarry", code: "unused_initial_carry" }],
      },
    });
    expect(tool.execute({ ...example.input, bitCount: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "bitCount", code: "invalid_field" }] },
    });
  });
});
