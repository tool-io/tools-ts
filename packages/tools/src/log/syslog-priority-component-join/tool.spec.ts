import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { priority: 165 } };
const close = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(b)) * 1e-10,
    );
  } else if (Array.isArray(b)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(b.length);
    b.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (b && typeof b === "object") {
    expect(a !== null && typeof a === "object").toBe(true);
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(b).sort());
    for (const [k, v] of Object.entries(b))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(b);
};
describe(tool.id, () => {
  it("matches the independently specified fixture", () =>
    close(calculate(example.input), expected));
  it("executes the same calculation", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes a valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects null and wrong field types", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : "bad",
        }),
      ).toMatchObject({ ok: false });
    }
  });
  it("rejects nonfinite and sparse evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
    }
  });
  it("enforces bounded strings and explicit arrays", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "string")
        expect(() =>
          calculate({ ...example.input, [k]: "x".repeat(8193) } as Input),
        ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(129).fill(v[0]) } as Input),
        ).toThrow();
    }
  });
  it("is reproducible and does not mutate inputs", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(s);
    close(example.output, expected);
  });
});

// Batch 55 targeted regressions
it("joins every valid syslog priority 0", () => {
  close(calculate({ facility: 0, severity: 0 } as Input), {
    result: { priority: 0 },
  });
}, 30000);
it("joins every valid syslog priority 1", () => {
  close(calculate({ facility: 0, severity: 1 } as Input), {
    result: { priority: 1 },
  });
}, 30000);
it("joins every valid syslog priority 2", () => {
  close(calculate({ facility: 0, severity: 2 } as Input), {
    result: { priority: 2 },
  });
}, 30000);
it("joins every valid syslog priority 3", () => {
  close(calculate({ facility: 0, severity: 3 } as Input), {
    result: { priority: 3 },
  });
}, 30000);
it("joins every valid syslog priority 4", () => {
  close(calculate({ facility: 0, severity: 4 } as Input), {
    result: { priority: 4 },
  });
}, 30000);
it("joins every valid syslog priority 5", () => {
  close(calculate({ facility: 0, severity: 5 } as Input), {
    result: { priority: 5 },
  });
}, 30000);
it("joins every valid syslog priority 6", () => {
  close(calculate({ facility: 0, severity: 6 } as Input), {
    result: { priority: 6 },
  });
}, 30000);
it("joins every valid syslog priority 7", () => {
  close(calculate({ facility: 0, severity: 7 } as Input), {
    result: { priority: 7 },
  });
}, 30000);
it("joins every valid syslog priority 8", () => {
  close(calculate({ facility: 1, severity: 0 } as Input), {
    result: { priority: 8 },
  });
}, 30000);
it("joins every valid syslog priority 9", () => {
  close(calculate({ facility: 1, severity: 1 } as Input), {
    result: { priority: 9 },
  });
}, 30000);
it("joins every valid syslog priority 10", () => {
  close(calculate({ facility: 1, severity: 2 } as Input), {
    result: { priority: 10 },
  });
}, 30000);
it("joins every valid syslog priority 11", () => {
  close(calculate({ facility: 1, severity: 3 } as Input), {
    result: { priority: 11 },
  });
}, 30000);
it("joins every valid syslog priority 12", () => {
  close(calculate({ facility: 1, severity: 4 } as Input), {
    result: { priority: 12 },
  });
}, 30000);
it("joins every valid syslog priority 13", () => {
  close(calculate({ facility: 1, severity: 5 } as Input), {
    result: { priority: 13 },
  });
}, 30000);
it("joins every valid syslog priority 14", () => {
  close(calculate({ facility: 1, severity: 6 } as Input), {
    result: { priority: 14 },
  });
}, 30000);
it("joins every valid syslog priority 15", () => {
  close(calculate({ facility: 1, severity: 7 } as Input), {
    result: { priority: 15 },
  });
}, 30000);
it("joins every valid syslog priority 16", () => {
  close(calculate({ facility: 2, severity: 0 } as Input), {
    result: { priority: 16 },
  });
}, 30000);
it("joins every valid syslog priority 17", () => {
  close(calculate({ facility: 2, severity: 1 } as Input), {
    result: { priority: 17 },
  });
}, 30000);
it("joins every valid syslog priority 18", () => {
  close(calculate({ facility: 2, severity: 2 } as Input), {
    result: { priority: 18 },
  });
}, 30000);
it("joins every valid syslog priority 19", () => {
  close(calculate({ facility: 2, severity: 3 } as Input), {
    result: { priority: 19 },
  });
}, 30000);
it("joins every valid syslog priority 20", () => {
  close(calculate({ facility: 2, severity: 4 } as Input), {
    result: { priority: 20 },
  });
}, 30000);
it("joins every valid syslog priority 21", () => {
  close(calculate({ facility: 2, severity: 5 } as Input), {
    result: { priority: 21 },
  });
}, 30000);
it("joins every valid syslog priority 22", () => {
  close(calculate({ facility: 2, severity: 6 } as Input), {
    result: { priority: 22 },
  });
}, 30000);
it("joins every valid syslog priority 23", () => {
  close(calculate({ facility: 2, severity: 7 } as Input), {
    result: { priority: 23 },
  });
}, 30000);
it("joins every valid syslog priority 24", () => {
  close(calculate({ facility: 3, severity: 0 } as Input), {
    result: { priority: 24 },
  });
}, 30000);
it("joins every valid syslog priority 25", () => {
  close(calculate({ facility: 3, severity: 1 } as Input), {
    result: { priority: 25 },
  });
}, 30000);
it("joins every valid syslog priority 26", () => {
  close(calculate({ facility: 3, severity: 2 } as Input), {
    result: { priority: 26 },
  });
}, 30000);
it("joins every valid syslog priority 27", () => {
  close(calculate({ facility: 3, severity: 3 } as Input), {
    result: { priority: 27 },
  });
}, 30000);
it("joins every valid syslog priority 28", () => {
  close(calculate({ facility: 3, severity: 4 } as Input), {
    result: { priority: 28 },
  });
}, 30000);
it("joins every valid syslog priority 29", () => {
  close(calculate({ facility: 3, severity: 5 } as Input), {
    result: { priority: 29 },
  });
}, 30000);
it("joins every valid syslog priority 30", () => {
  close(calculate({ facility: 3, severity: 6 } as Input), {
    result: { priority: 30 },
  });
}, 30000);
it("joins every valid syslog priority 31", () => {
  close(calculate({ facility: 3, severity: 7 } as Input), {
    result: { priority: 31 },
  });
}, 30000);
it("joins every valid syslog priority 32", () => {
  close(calculate({ facility: 4, severity: 0 } as Input), {
    result: { priority: 32 },
  });
}, 30000);
it("joins every valid syslog priority 33", () => {
  close(calculate({ facility: 4, severity: 1 } as Input), {
    result: { priority: 33 },
  });
}, 30000);
it("joins every valid syslog priority 34", () => {
  close(calculate({ facility: 4, severity: 2 } as Input), {
    result: { priority: 34 },
  });
}, 30000);
it("joins every valid syslog priority 35", () => {
  close(calculate({ facility: 4, severity: 3 } as Input), {
    result: { priority: 35 },
  });
}, 30000);
it("joins every valid syslog priority 36", () => {
  close(calculate({ facility: 4, severity: 4 } as Input), {
    result: { priority: 36 },
  });
}, 30000);
it("joins every valid syslog priority 37", () => {
  close(calculate({ facility: 4, severity: 5 } as Input), {
    result: { priority: 37 },
  });
}, 30000);
it("joins every valid syslog priority 38", () => {
  close(calculate({ facility: 4, severity: 6 } as Input), {
    result: { priority: 38 },
  });
}, 30000);
it("joins every valid syslog priority 39", () => {
  close(calculate({ facility: 4, severity: 7 } as Input), {
    result: { priority: 39 },
  });
}, 30000);
it("joins every valid syslog priority 40", () => {
  close(calculate({ facility: 5, severity: 0 } as Input), {
    result: { priority: 40 },
  });
}, 30000);
it("joins every valid syslog priority 41", () => {
  close(calculate({ facility: 5, severity: 1 } as Input), {
    result: { priority: 41 },
  });
}, 30000);
it("joins every valid syslog priority 42", () => {
  close(calculate({ facility: 5, severity: 2 } as Input), {
    result: { priority: 42 },
  });
}, 30000);
it("joins every valid syslog priority 43", () => {
  close(calculate({ facility: 5, severity: 3 } as Input), {
    result: { priority: 43 },
  });
}, 30000);
it("joins every valid syslog priority 44", () => {
  close(calculate({ facility: 5, severity: 4 } as Input), {
    result: { priority: 44 },
  });
}, 30000);
it("joins every valid syslog priority 45", () => {
  close(calculate({ facility: 5, severity: 5 } as Input), {
    result: { priority: 45 },
  });
}, 30000);
it("joins every valid syslog priority 46", () => {
  close(calculate({ facility: 5, severity: 6 } as Input), {
    result: { priority: 46 },
  });
}, 30000);
it("joins every valid syslog priority 47", () => {
  close(calculate({ facility: 5, severity: 7 } as Input), {
    result: { priority: 47 },
  });
}, 30000);
it("joins every valid syslog priority 48", () => {
  close(calculate({ facility: 6, severity: 0 } as Input), {
    result: { priority: 48 },
  });
}, 30000);
it("joins every valid syslog priority 49", () => {
  close(calculate({ facility: 6, severity: 1 } as Input), {
    result: { priority: 49 },
  });
}, 30000);
it("joins every valid syslog priority 50", () => {
  close(calculate({ facility: 6, severity: 2 } as Input), {
    result: { priority: 50 },
  });
}, 30000);
it("joins every valid syslog priority 51", () => {
  close(calculate({ facility: 6, severity: 3 } as Input), {
    result: { priority: 51 },
  });
}, 30000);
it("joins every valid syslog priority 52", () => {
  close(calculate({ facility: 6, severity: 4 } as Input), {
    result: { priority: 52 },
  });
}, 30000);
it("joins every valid syslog priority 53", () => {
  close(calculate({ facility: 6, severity: 5 } as Input), {
    result: { priority: 53 },
  });
}, 30000);
it("joins every valid syslog priority 54", () => {
  close(calculate({ facility: 6, severity: 6 } as Input), {
    result: { priority: 54 },
  });
}, 30000);
it("joins every valid syslog priority 55", () => {
  close(calculate({ facility: 6, severity: 7 } as Input), {
    result: { priority: 55 },
  });
}, 30000);
it("joins every valid syslog priority 56", () => {
  close(calculate({ facility: 7, severity: 0 } as Input), {
    result: { priority: 56 },
  });
}, 30000);
it("joins every valid syslog priority 57", () => {
  close(calculate({ facility: 7, severity: 1 } as Input), {
    result: { priority: 57 },
  });
}, 30000);
it("joins every valid syslog priority 58", () => {
  close(calculate({ facility: 7, severity: 2 } as Input), {
    result: { priority: 58 },
  });
}, 30000);
it("joins every valid syslog priority 59", () => {
  close(calculate({ facility: 7, severity: 3 } as Input), {
    result: { priority: 59 },
  });
}, 30000);
it("joins every valid syslog priority 60", () => {
  close(calculate({ facility: 7, severity: 4 } as Input), {
    result: { priority: 60 },
  });
}, 30000);
it("joins every valid syslog priority 61", () => {
  close(calculate({ facility: 7, severity: 5 } as Input), {
    result: { priority: 61 },
  });
}, 30000);
it("joins every valid syslog priority 62", () => {
  close(calculate({ facility: 7, severity: 6 } as Input), {
    result: { priority: 62 },
  });
}, 30000);
it("joins every valid syslog priority 63", () => {
  close(calculate({ facility: 7, severity: 7 } as Input), {
    result: { priority: 63 },
  });
}, 30000);
it("joins every valid syslog priority 64", () => {
  close(calculate({ facility: 8, severity: 0 } as Input), {
    result: { priority: 64 },
  });
}, 30000);
it("joins every valid syslog priority 65", () => {
  close(calculate({ facility: 8, severity: 1 } as Input), {
    result: { priority: 65 },
  });
}, 30000);
it("joins every valid syslog priority 66", () => {
  close(calculate({ facility: 8, severity: 2 } as Input), {
    result: { priority: 66 },
  });
}, 30000);
it("joins every valid syslog priority 67", () => {
  close(calculate({ facility: 8, severity: 3 } as Input), {
    result: { priority: 67 },
  });
}, 30000);
it("joins every valid syslog priority 68", () => {
  close(calculate({ facility: 8, severity: 4 } as Input), {
    result: { priority: 68 },
  });
}, 30000);
it("joins every valid syslog priority 69", () => {
  close(calculate({ facility: 8, severity: 5 } as Input), {
    result: { priority: 69 },
  });
}, 30000);
it("joins every valid syslog priority 70", () => {
  close(calculate({ facility: 8, severity: 6 } as Input), {
    result: { priority: 70 },
  });
}, 30000);
it("joins every valid syslog priority 71", () => {
  close(calculate({ facility: 8, severity: 7 } as Input), {
    result: { priority: 71 },
  });
}, 30000);
it("joins every valid syslog priority 72", () => {
  close(calculate({ facility: 9, severity: 0 } as Input), {
    result: { priority: 72 },
  });
}, 30000);
it("joins every valid syslog priority 73", () => {
  close(calculate({ facility: 9, severity: 1 } as Input), {
    result: { priority: 73 },
  });
}, 30000);
it("joins every valid syslog priority 74", () => {
  close(calculate({ facility: 9, severity: 2 } as Input), {
    result: { priority: 74 },
  });
}, 30000);
it("joins every valid syslog priority 75", () => {
  close(calculate({ facility: 9, severity: 3 } as Input), {
    result: { priority: 75 },
  });
}, 30000);
it("joins every valid syslog priority 76", () => {
  close(calculate({ facility: 9, severity: 4 } as Input), {
    result: { priority: 76 },
  });
}, 30000);
it("joins every valid syslog priority 77", () => {
  close(calculate({ facility: 9, severity: 5 } as Input), {
    result: { priority: 77 },
  });
}, 30000);
it("joins every valid syslog priority 78", () => {
  close(calculate({ facility: 9, severity: 6 } as Input), {
    result: { priority: 78 },
  });
}, 30000);
it("joins every valid syslog priority 79", () => {
  close(calculate({ facility: 9, severity: 7 } as Input), {
    result: { priority: 79 },
  });
}, 30000);
it("joins every valid syslog priority 80", () => {
  close(calculate({ facility: 10, severity: 0 } as Input), {
    result: { priority: 80 },
  });
}, 30000);
it("joins every valid syslog priority 81", () => {
  close(calculate({ facility: 10, severity: 1 } as Input), {
    result: { priority: 81 },
  });
}, 30000);
it("joins every valid syslog priority 82", () => {
  close(calculate({ facility: 10, severity: 2 } as Input), {
    result: { priority: 82 },
  });
}, 30000);
it("joins every valid syslog priority 83", () => {
  close(calculate({ facility: 10, severity: 3 } as Input), {
    result: { priority: 83 },
  });
}, 30000);
it("joins every valid syslog priority 84", () => {
  close(calculate({ facility: 10, severity: 4 } as Input), {
    result: { priority: 84 },
  });
}, 30000);
it("joins every valid syslog priority 85", () => {
  close(calculate({ facility: 10, severity: 5 } as Input), {
    result: { priority: 85 },
  });
}, 30000);
it("joins every valid syslog priority 86", () => {
  close(calculate({ facility: 10, severity: 6 } as Input), {
    result: { priority: 86 },
  });
}, 30000);
it("joins every valid syslog priority 87", () => {
  close(calculate({ facility: 10, severity: 7 } as Input), {
    result: { priority: 87 },
  });
}, 30000);
it("joins every valid syslog priority 88", () => {
  close(calculate({ facility: 11, severity: 0 } as Input), {
    result: { priority: 88 },
  });
}, 30000);
it("joins every valid syslog priority 89", () => {
  close(calculate({ facility: 11, severity: 1 } as Input), {
    result: { priority: 89 },
  });
}, 30000);
it("joins every valid syslog priority 90", () => {
  close(calculate({ facility: 11, severity: 2 } as Input), {
    result: { priority: 90 },
  });
}, 30000);
it("joins every valid syslog priority 91", () => {
  close(calculate({ facility: 11, severity: 3 } as Input), {
    result: { priority: 91 },
  });
}, 30000);
it("joins every valid syslog priority 92", () => {
  close(calculate({ facility: 11, severity: 4 } as Input), {
    result: { priority: 92 },
  });
}, 30000);
it("joins every valid syslog priority 93", () => {
  close(calculate({ facility: 11, severity: 5 } as Input), {
    result: { priority: 93 },
  });
}, 30000);
it("joins every valid syslog priority 94", () => {
  close(calculate({ facility: 11, severity: 6 } as Input), {
    result: { priority: 94 },
  });
}, 30000);
it("joins every valid syslog priority 95", () => {
  close(calculate({ facility: 11, severity: 7 } as Input), {
    result: { priority: 95 },
  });
}, 30000);
it("joins every valid syslog priority 96", () => {
  close(calculate({ facility: 12, severity: 0 } as Input), {
    result: { priority: 96 },
  });
}, 30000);
it("joins every valid syslog priority 97", () => {
  close(calculate({ facility: 12, severity: 1 } as Input), {
    result: { priority: 97 },
  });
}, 30000);
it("joins every valid syslog priority 98", () => {
  close(calculate({ facility: 12, severity: 2 } as Input), {
    result: { priority: 98 },
  });
}, 30000);
it("joins every valid syslog priority 99", () => {
  close(calculate({ facility: 12, severity: 3 } as Input), {
    result: { priority: 99 },
  });
}, 30000);
it("joins every valid syslog priority 100", () => {
  close(calculate({ facility: 12, severity: 4 } as Input), {
    result: { priority: 100 },
  });
}, 30000);
it("joins every valid syslog priority 101", () => {
  close(calculate({ facility: 12, severity: 5 } as Input), {
    result: { priority: 101 },
  });
}, 30000);
it("joins every valid syslog priority 102", () => {
  close(calculate({ facility: 12, severity: 6 } as Input), {
    result: { priority: 102 },
  });
}, 30000);
it("joins every valid syslog priority 103", () => {
  close(calculate({ facility: 12, severity: 7 } as Input), {
    result: { priority: 103 },
  });
}, 30000);
it("joins every valid syslog priority 104", () => {
  close(calculate({ facility: 13, severity: 0 } as Input), {
    result: { priority: 104 },
  });
}, 30000);
it("joins every valid syslog priority 105", () => {
  close(calculate({ facility: 13, severity: 1 } as Input), {
    result: { priority: 105 },
  });
}, 30000);
it("joins every valid syslog priority 106", () => {
  close(calculate({ facility: 13, severity: 2 } as Input), {
    result: { priority: 106 },
  });
}, 30000);
it("joins every valid syslog priority 107", () => {
  close(calculate({ facility: 13, severity: 3 } as Input), {
    result: { priority: 107 },
  });
}, 30000);
it("joins every valid syslog priority 108", () => {
  close(calculate({ facility: 13, severity: 4 } as Input), {
    result: { priority: 108 },
  });
}, 30000);
it("joins every valid syslog priority 109", () => {
  close(calculate({ facility: 13, severity: 5 } as Input), {
    result: { priority: 109 },
  });
}, 30000);
it("joins every valid syslog priority 110", () => {
  close(calculate({ facility: 13, severity: 6 } as Input), {
    result: { priority: 110 },
  });
}, 30000);
it("joins every valid syslog priority 111", () => {
  close(calculate({ facility: 13, severity: 7 } as Input), {
    result: { priority: 111 },
  });
}, 30000);
it("joins every valid syslog priority 112", () => {
  close(calculate({ facility: 14, severity: 0 } as Input), {
    result: { priority: 112 },
  });
}, 30000);
it("joins every valid syslog priority 113", () => {
  close(calculate({ facility: 14, severity: 1 } as Input), {
    result: { priority: 113 },
  });
}, 30000);
it("joins every valid syslog priority 114", () => {
  close(calculate({ facility: 14, severity: 2 } as Input), {
    result: { priority: 114 },
  });
}, 30000);
it("joins every valid syslog priority 115", () => {
  close(calculate({ facility: 14, severity: 3 } as Input), {
    result: { priority: 115 },
  });
}, 30000);
it("joins every valid syslog priority 116", () => {
  close(calculate({ facility: 14, severity: 4 } as Input), {
    result: { priority: 116 },
  });
}, 30000);
it("joins every valid syslog priority 117", () => {
  close(calculate({ facility: 14, severity: 5 } as Input), {
    result: { priority: 117 },
  });
}, 30000);
it("joins every valid syslog priority 118", () => {
  close(calculate({ facility: 14, severity: 6 } as Input), {
    result: { priority: 118 },
  });
}, 30000);
it("joins every valid syslog priority 119", () => {
  close(calculate({ facility: 14, severity: 7 } as Input), {
    result: { priority: 119 },
  });
}, 30000);
it("joins every valid syslog priority 120", () => {
  close(calculate({ facility: 15, severity: 0 } as Input), {
    result: { priority: 120 },
  });
}, 30000);
it("joins every valid syslog priority 121", () => {
  close(calculate({ facility: 15, severity: 1 } as Input), {
    result: { priority: 121 },
  });
}, 30000);
it("joins every valid syslog priority 122", () => {
  close(calculate({ facility: 15, severity: 2 } as Input), {
    result: { priority: 122 },
  });
}, 30000);
it("joins every valid syslog priority 123", () => {
  close(calculate({ facility: 15, severity: 3 } as Input), {
    result: { priority: 123 },
  });
}, 30000);
it("joins every valid syslog priority 124", () => {
  close(calculate({ facility: 15, severity: 4 } as Input), {
    result: { priority: 124 },
  });
}, 30000);
it("joins every valid syslog priority 125", () => {
  close(calculate({ facility: 15, severity: 5 } as Input), {
    result: { priority: 125 },
  });
}, 30000);
it("joins every valid syslog priority 126", () => {
  close(calculate({ facility: 15, severity: 6 } as Input), {
    result: { priority: 126 },
  });
}, 30000);
it("joins every valid syslog priority 127", () => {
  close(calculate({ facility: 15, severity: 7 } as Input), {
    result: { priority: 127 },
  });
}, 30000);
it("joins every valid syslog priority 128", () => {
  close(calculate({ facility: 16, severity: 0 } as Input), {
    result: { priority: 128 },
  });
}, 30000);
it("joins every valid syslog priority 129", () => {
  close(calculate({ facility: 16, severity: 1 } as Input), {
    result: { priority: 129 },
  });
}, 30000);
it("joins every valid syslog priority 130", () => {
  close(calculate({ facility: 16, severity: 2 } as Input), {
    result: { priority: 130 },
  });
}, 30000);
it("joins every valid syslog priority 131", () => {
  close(calculate({ facility: 16, severity: 3 } as Input), {
    result: { priority: 131 },
  });
}, 30000);
it("joins every valid syslog priority 132", () => {
  close(calculate({ facility: 16, severity: 4 } as Input), {
    result: { priority: 132 },
  });
}, 30000);
it("joins every valid syslog priority 133", () => {
  close(calculate({ facility: 16, severity: 5 } as Input), {
    result: { priority: 133 },
  });
}, 30000);
it("joins every valid syslog priority 134", () => {
  close(calculate({ facility: 16, severity: 6 } as Input), {
    result: { priority: 134 },
  });
}, 30000);
it("joins every valid syslog priority 135", () => {
  close(calculate({ facility: 16, severity: 7 } as Input), {
    result: { priority: 135 },
  });
}, 30000);
it("joins every valid syslog priority 136", () => {
  close(calculate({ facility: 17, severity: 0 } as Input), {
    result: { priority: 136 },
  });
}, 30000);
it("joins every valid syslog priority 137", () => {
  close(calculate({ facility: 17, severity: 1 } as Input), {
    result: { priority: 137 },
  });
}, 30000);
it("joins every valid syslog priority 138", () => {
  close(calculate({ facility: 17, severity: 2 } as Input), {
    result: { priority: 138 },
  });
}, 30000);
it("joins every valid syslog priority 139", () => {
  close(calculate({ facility: 17, severity: 3 } as Input), {
    result: { priority: 139 },
  });
}, 30000);
it("joins every valid syslog priority 140", () => {
  close(calculate({ facility: 17, severity: 4 } as Input), {
    result: { priority: 140 },
  });
}, 30000);
it("joins every valid syslog priority 141", () => {
  close(calculate({ facility: 17, severity: 5 } as Input), {
    result: { priority: 141 },
  });
}, 30000);
it("joins every valid syslog priority 142", () => {
  close(calculate({ facility: 17, severity: 6 } as Input), {
    result: { priority: 142 },
  });
}, 30000);
it("joins every valid syslog priority 143", () => {
  close(calculate({ facility: 17, severity: 7 } as Input), {
    result: { priority: 143 },
  });
}, 30000);
it("joins every valid syslog priority 144", () => {
  close(calculate({ facility: 18, severity: 0 } as Input), {
    result: { priority: 144 },
  });
}, 30000);
it("joins every valid syslog priority 145", () => {
  close(calculate({ facility: 18, severity: 1 } as Input), {
    result: { priority: 145 },
  });
}, 30000);
it("joins every valid syslog priority 146", () => {
  close(calculate({ facility: 18, severity: 2 } as Input), {
    result: { priority: 146 },
  });
}, 30000);
it("joins every valid syslog priority 147", () => {
  close(calculate({ facility: 18, severity: 3 } as Input), {
    result: { priority: 147 },
  });
}, 30000);
it("joins every valid syslog priority 148", () => {
  close(calculate({ facility: 18, severity: 4 } as Input), {
    result: { priority: 148 },
  });
}, 30000);
it("joins every valid syslog priority 149", () => {
  close(calculate({ facility: 18, severity: 5 } as Input), {
    result: { priority: 149 },
  });
}, 30000);
it("joins every valid syslog priority 150", () => {
  close(calculate({ facility: 18, severity: 6 } as Input), {
    result: { priority: 150 },
  });
}, 30000);
it("joins every valid syslog priority 151", () => {
  close(calculate({ facility: 18, severity: 7 } as Input), {
    result: { priority: 151 },
  });
}, 30000);
it("joins every valid syslog priority 152", () => {
  close(calculate({ facility: 19, severity: 0 } as Input), {
    result: { priority: 152 },
  });
}, 30000);
it("joins every valid syslog priority 153", () => {
  close(calculate({ facility: 19, severity: 1 } as Input), {
    result: { priority: 153 },
  });
}, 30000);
it("joins every valid syslog priority 154", () => {
  close(calculate({ facility: 19, severity: 2 } as Input), {
    result: { priority: 154 },
  });
}, 30000);
it("joins every valid syslog priority 155", () => {
  close(calculate({ facility: 19, severity: 3 } as Input), {
    result: { priority: 155 },
  });
}, 30000);
it("joins every valid syslog priority 156", () => {
  close(calculate({ facility: 19, severity: 4 } as Input), {
    result: { priority: 156 },
  });
}, 30000);
it("joins every valid syslog priority 157", () => {
  close(calculate({ facility: 19, severity: 5 } as Input), {
    result: { priority: 157 },
  });
}, 30000);
it("joins every valid syslog priority 158", () => {
  close(calculate({ facility: 19, severity: 6 } as Input), {
    result: { priority: 158 },
  });
}, 30000);
it("joins every valid syslog priority 159", () => {
  close(calculate({ facility: 19, severity: 7 } as Input), {
    result: { priority: 159 },
  });
}, 30000);
it("joins every valid syslog priority 160", () => {
  close(calculate({ facility: 20, severity: 0 } as Input), {
    result: { priority: 160 },
  });
}, 30000);
it("joins every valid syslog priority 161", () => {
  close(calculate({ facility: 20, severity: 1 } as Input), {
    result: { priority: 161 },
  });
}, 30000);
it("joins every valid syslog priority 162", () => {
  close(calculate({ facility: 20, severity: 2 } as Input), {
    result: { priority: 162 },
  });
}, 30000);
it("joins every valid syslog priority 163", () => {
  close(calculate({ facility: 20, severity: 3 } as Input), {
    result: { priority: 163 },
  });
}, 30000);
it("joins every valid syslog priority 164", () => {
  close(calculate({ facility: 20, severity: 4 } as Input), {
    result: { priority: 164 },
  });
}, 30000);
it("joins every valid syslog priority 165", () => {
  close(calculate({ facility: 20, severity: 5 } as Input), {
    result: { priority: 165 },
  });
}, 30000);
it("joins every valid syslog priority 166", () => {
  close(calculate({ facility: 20, severity: 6 } as Input), {
    result: { priority: 166 },
  });
}, 30000);
it("joins every valid syslog priority 167", () => {
  close(calculate({ facility: 20, severity: 7 } as Input), {
    result: { priority: 167 },
  });
}, 30000);
it("joins every valid syslog priority 168", () => {
  close(calculate({ facility: 21, severity: 0 } as Input), {
    result: { priority: 168 },
  });
}, 30000);
it("joins every valid syslog priority 169", () => {
  close(calculate({ facility: 21, severity: 1 } as Input), {
    result: { priority: 169 },
  });
}, 30000);
it("joins every valid syslog priority 170", () => {
  close(calculate({ facility: 21, severity: 2 } as Input), {
    result: { priority: 170 },
  });
}, 30000);
it("joins every valid syslog priority 171", () => {
  close(calculate({ facility: 21, severity: 3 } as Input), {
    result: { priority: 171 },
  });
}, 30000);
it("joins every valid syslog priority 172", () => {
  close(calculate({ facility: 21, severity: 4 } as Input), {
    result: { priority: 172 },
  });
}, 30000);
it("joins every valid syslog priority 173", () => {
  close(calculate({ facility: 21, severity: 5 } as Input), {
    result: { priority: 173 },
  });
}, 30000);
it("joins every valid syslog priority 174", () => {
  close(calculate({ facility: 21, severity: 6 } as Input), {
    result: { priority: 174 },
  });
}, 30000);
it("joins every valid syslog priority 175", () => {
  close(calculate({ facility: 21, severity: 7 } as Input), {
    result: { priority: 175 },
  });
}, 30000);
it("joins every valid syslog priority 176", () => {
  close(calculate({ facility: 22, severity: 0 } as Input), {
    result: { priority: 176 },
  });
}, 30000);
it("joins every valid syslog priority 177", () => {
  close(calculate({ facility: 22, severity: 1 } as Input), {
    result: { priority: 177 },
  });
}, 30000);
it("joins every valid syslog priority 178", () => {
  close(calculate({ facility: 22, severity: 2 } as Input), {
    result: { priority: 178 },
  });
}, 30000);
it("joins every valid syslog priority 179", () => {
  close(calculate({ facility: 22, severity: 3 } as Input), {
    result: { priority: 179 },
  });
}, 30000);
it("joins every valid syslog priority 180", () => {
  close(calculate({ facility: 22, severity: 4 } as Input), {
    result: { priority: 180 },
  });
}, 30000);
it("joins every valid syslog priority 181", () => {
  close(calculate({ facility: 22, severity: 5 } as Input), {
    result: { priority: 181 },
  });
}, 30000);
it("joins every valid syslog priority 182", () => {
  close(calculate({ facility: 22, severity: 6 } as Input), {
    result: { priority: 182 },
  });
}, 30000);
it("joins every valid syslog priority 183", () => {
  close(calculate({ facility: 22, severity: 7 } as Input), {
    result: { priority: 183 },
  });
}, 30000);
it("joins every valid syslog priority 184", () => {
  close(calculate({ facility: 23, severity: 0 } as Input), {
    result: { priority: 184 },
  });
}, 30000);
it("joins every valid syslog priority 185", () => {
  close(calculate({ facility: 23, severity: 1 } as Input), {
    result: { priority: 185 },
  });
}, 30000);
it("joins every valid syslog priority 186", () => {
  close(calculate({ facility: 23, severity: 2 } as Input), {
    result: { priority: 186 },
  });
}, 30000);
it("joins every valid syslog priority 187", () => {
  close(calculate({ facility: 23, severity: 3 } as Input), {
    result: { priority: 187 },
  });
}, 30000);
it("joins every valid syslog priority 188", () => {
  close(calculate({ facility: 23, severity: 4 } as Input), {
    result: { priority: 188 },
  });
}, 30000);
it("joins every valid syslog priority 189", () => {
  close(calculate({ facility: 23, severity: 5 } as Input), {
    result: { priority: 189 },
  });
}, 30000);
it("joins every valid syslog priority 190", () => {
  close(calculate({ facility: 23, severity: 6 } as Input), {
    result: { priority: 190 },
  });
}, 30000);
it("joins every valid syslog priority 191", () => {
  close(calculate({ facility: 23, severity: 7 } as Input), {
    result: { priority: 191 },
  });
}, 30000);
