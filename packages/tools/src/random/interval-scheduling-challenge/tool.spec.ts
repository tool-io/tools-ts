import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateIntervalSchedulingChallenge,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Exact interval scheduling", () => {
  lightweightModelTests(tool, calculateIntervalSchedulingChallenge, example);
  it("lightweight independently separates weighted optimum from touching-job count optimum", () => {
    const context = () => {
      const draws = [0, 0.99, 0.99, 0, 0.3, 0, 0.5, 0.99, 0];
      return { random: () => draws.shift() ?? 0 };
    };
    const input = { jobCount: 3, horizon: 4, maximumDuration: 4 };
    expect(
      tool.execute({ ...input, objective: "weight" }, context()),
    ).toMatchObject({
      ok: true,
      output: {
        jobs: [
          { id: 0, start: 0, endExclusive: 4, weight: 9 },
          { id: 1, start: 0, endExclusive: 2, weight: 1 },
          { id: 2, start: 2, endExclusive: 4, weight: 1 },
        ],
        selectedIds: [0],
        objectiveValue: 9,
      },
    });
    expect(
      tool.execute({ ...input, objective: "count" }, context()),
    ).toMatchObject({
      ok: true,
      output: { selectedIds: [1, 2], objectiveValue: 2 },
    });
  });
  it("lightweight rejects unsupported resource counts and objectives", () => {
    expect(tool.execute({ ...example.input, jobCount: 17 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "jobCount", code: "invalid_field" }] },
    });
    expect(
      tool.execute({ ...example.input, objective: "duration" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "objective", code: "invalid_field" }] },
    });
  });
});
