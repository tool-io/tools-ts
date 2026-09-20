import { describe, expect, it } from "vitest";
import tool, {
  calculateBalancedFactorialAssignment,
  balancedFactorialAssignmentExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateBalancedFactorialAssignment, example);
  it("independently checks a 2x3 design with two replicas per treatment", () => {
    const input = {
      factors: [
        { name: "light", levels: ["dim", "bright"] },
        { name: "dose", levels: ["none", "low", "high"] },
      ],
      unitIds: Array.from({ length: 12 }, (_, i) => `pot-${i}`),
      replication: 2,
      seed: 7,
    };
    const result = calculateBalancedFactorialAssignment(input);
    if (!result.ok) throw new Error("Expected success");
    expect(
      result.output.combinations.map((combination) => combination.levels),
    ).toEqual([
      ["dim", "none"],
      ["dim", "low"],
      ["dim", "high"],
      ["bright", "none"],
      ["bright", "low"],
      ["bright", "high"],
    ]);
    expect(
      result.output.combinations.map((combination) => combination.count),
    ).toEqual([2, 2, 2, 2, 2, 2]);
    for (const combination of result.output.combinations)
      expect(
        result.output.assignments.filter(
          (assignment) =>
            assignment.levels.join("/") === combination.levels.join("/"),
        ),
      ).toHaveLength(2);
    expect(
      result.output.assignments.map((assignment) => assignment.unitId),
    ).toEqual(input.unitIds);
  });
  it("retains a single-level factor without dropping its label", () => {
    expect(
      tool.execute({
        factors: [{ name: "control", levels: ["vehicle"] }],
        unitIds: ["sample-a", "sample-b"],
        replication: 2,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        factorNames: ["control"],
        combinations: [{ levels: ["vehicle"], count: 2 }],
        assignments: [
          { unitId: "sample-a", levels: ["vehicle"] },
          { unitId: "sample-b", levels: ["vehicle"] },
        ],
      },
    });
  });
  it("rejects unit shortages, duplicate units/levels/factors, and factorial explosion", () => {
    expect(tool.execute({ ...example.input, replication: 2 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "unitIds", code: "infeasible_replication" }] },
    });
    expect(
      tool.execute({ ...example.input, unitIds: ["u1", "u1", "u3", "u4"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "unitIds", code: "duplicate_id" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        factors: [{ name: "dose", levels: ["low", "low"] }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "factors", code: "duplicate_id" }] },
    });
    const levels = Array.from({ length: 16 }, (_, i) => String(i));
    expect(
      tool.execute({
        ...example.input,
        factors: [
          { name: "a", levels },
          { name: "b", levels },
          { name: "c", levels: ["x", "y"] },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "factors", code: "resource_limit_exceeded" }],
      },
    });
  });
});
