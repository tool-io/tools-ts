import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  roughSetApproximationsExample as example,
  calculateRoughSetApproximations,
} from "./tool.js";

describe("Rough Set Lower and Upper Approximation Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRoughSetApproximations(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("verifies approximations by direct pairwise indiscernibility for every small target", () => {
    const rows = [
      ["r", "s"],
      ["r", "m"],
      ["b", "s"],
      ["b", "s"],
    ];
    for (const conditionColumns of [[], [0], [1], [0, 1]])
      for (let mask = 0; mask < 16; mask += 1) {
        const targetRows = rows.flatMap((_, i) => (mask & (1 << i) ? [i] : []));
        const result = tool.execute({ rows, conditionColumns, targetRows });
        if (!result.ok) throw new Error("Expected success");
        const lower: number[] = [],
          upper: number[] = [];
        rows.forEach((row, i) => {
          const related = rows.flatMap((other, j) =>
            conditionColumns.every((c) => row[c] === other[c]) ? [j] : [],
          );
          if (related.every((j) => targetRows.includes(j))) lower.push(i);
          if (related.some((j) => targetRows.includes(j))) upper.push(i);
        });
        expect(result.output.lower).toEqual(lower);
        expect(result.output.upper).toEqual(upper);
        expect(result.output.boundary).toEqual(
          upper.filter((i) => !lower.includes(i)),
        );
        expect(result.output.negative).toEqual(
          rows.flatMap((_, i) => (!upper.includes(i) ? [i] : [])),
        );
      }
  });
  it("handles exact tuple identity and rejects invalid references and ragged rows", () => {
    const result = tool.execute({
      rows: [
        ["a", "b\u0000c"],
        ["a\u0000b", "c"],
      ],
      conditionColumns: [0, 1],
      targetRows: [0],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.equivalenceClasses).toEqual([[0], [1]]);
    expect(result.output.lower).toEqual([0]);
    expect(
      tool.execute({ ...example.input, conditionColumns: [0, 0] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "conditionColumns", code: "invalid_column_selection" },
        ],
      },
    });
    expect(tool.execute({ ...example.input, targetRows: [4] })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "targetRows", code: "invalid_target_selection" }],
      },
    });
    expect(tool.execute({ ...example.input, rows: [["a"], []] })).toMatchObject(
      {
        ok: false,
        error: { issues: [{ field: "rows", code: "ragged_rows" }] },
      },
    );
  });
});
