import { describe, expect, it } from "vitest";
import tool, { example, calculateTopKFrequencyWorkload } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Top k tie workload", () => {
  lightweightModelTests(tool, calculateTopKFrequencyWorkload, example);
  it("lightweight independently honors first-occurrence and bank ties", () => {
    const first = tool.execute({ ...example.input, tiePolicy: "first", k: 2 });
    if (!first.ok) throw new Error("Expected frequency workload");
    expect(first.output.topKeys).toEqual(["b", "a"]);
    expect(first.output.ranking).toEqual([
      { key: "b", count: 2 },
      { key: "a", count: 2 },
    ]);
    expect(first.output.stream.filter((token) => token === "a")).toHaveLength(
      2,
    );
  });
  it("lightweight rejects invalid k and multiplicative output bounds", () => {
    expect(tool.execute({ ...example.input, k: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "k", code: "invalid_k" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        tokens: [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
        ],
        repetitionsPerToken: 4,
        extraCount: 16,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extraCount", code: "resource_limit" }] },
    });
  });
});
