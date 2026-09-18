import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { facility: 20, severity: 5 } };
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
it("splits every valid syslog priority 0", () => {
  close(calculate({ priority: 0 } as Input), {
    result: { facility: 0, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 1", () => {
  close(calculate({ priority: 1 } as Input), {
    result: { facility: 0, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 2", () => {
  close(calculate({ priority: 2 } as Input), {
    result: { facility: 0, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 3", () => {
  close(calculate({ priority: 3 } as Input), {
    result: { facility: 0, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 4", () => {
  close(calculate({ priority: 4 } as Input), {
    result: { facility: 0, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 5", () => {
  close(calculate({ priority: 5 } as Input), {
    result: { facility: 0, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 6", () => {
  close(calculate({ priority: 6 } as Input), {
    result: { facility: 0, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 7", () => {
  close(calculate({ priority: 7 } as Input), {
    result: { facility: 0, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 8", () => {
  close(calculate({ priority: 8 } as Input), {
    result: { facility: 1, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 9", () => {
  close(calculate({ priority: 9 } as Input), {
    result: { facility: 1, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 10", () => {
  close(calculate({ priority: 10 } as Input), {
    result: { facility: 1, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 11", () => {
  close(calculate({ priority: 11 } as Input), {
    result: { facility: 1, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 12", () => {
  close(calculate({ priority: 12 } as Input), {
    result: { facility: 1, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 13", () => {
  close(calculate({ priority: 13 } as Input), {
    result: { facility: 1, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 14", () => {
  close(calculate({ priority: 14 } as Input), {
    result: { facility: 1, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 15", () => {
  close(calculate({ priority: 15 } as Input), {
    result: { facility: 1, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 16", () => {
  close(calculate({ priority: 16 } as Input), {
    result: { facility: 2, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 17", () => {
  close(calculate({ priority: 17 } as Input), {
    result: { facility: 2, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 18", () => {
  close(calculate({ priority: 18 } as Input), {
    result: { facility: 2, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 19", () => {
  close(calculate({ priority: 19 } as Input), {
    result: { facility: 2, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 20", () => {
  close(calculate({ priority: 20 } as Input), {
    result: { facility: 2, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 21", () => {
  close(calculate({ priority: 21 } as Input), {
    result: { facility: 2, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 22", () => {
  close(calculate({ priority: 22 } as Input), {
    result: { facility: 2, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 23", () => {
  close(calculate({ priority: 23 } as Input), {
    result: { facility: 2, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 24", () => {
  close(calculate({ priority: 24 } as Input), {
    result: { facility: 3, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 25", () => {
  close(calculate({ priority: 25 } as Input), {
    result: { facility: 3, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 26", () => {
  close(calculate({ priority: 26 } as Input), {
    result: { facility: 3, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 27", () => {
  close(calculate({ priority: 27 } as Input), {
    result: { facility: 3, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 28", () => {
  close(calculate({ priority: 28 } as Input), {
    result: { facility: 3, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 29", () => {
  close(calculate({ priority: 29 } as Input), {
    result: { facility: 3, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 30", () => {
  close(calculate({ priority: 30 } as Input), {
    result: { facility: 3, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 31", () => {
  close(calculate({ priority: 31 } as Input), {
    result: { facility: 3, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 32", () => {
  close(calculate({ priority: 32 } as Input), {
    result: { facility: 4, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 33", () => {
  close(calculate({ priority: 33 } as Input), {
    result: { facility: 4, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 34", () => {
  close(calculate({ priority: 34 } as Input), {
    result: { facility: 4, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 35", () => {
  close(calculate({ priority: 35 } as Input), {
    result: { facility: 4, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 36", () => {
  close(calculate({ priority: 36 } as Input), {
    result: { facility: 4, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 37", () => {
  close(calculate({ priority: 37 } as Input), {
    result: { facility: 4, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 38", () => {
  close(calculate({ priority: 38 } as Input), {
    result: { facility: 4, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 39", () => {
  close(calculate({ priority: 39 } as Input), {
    result: { facility: 4, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 40", () => {
  close(calculate({ priority: 40 } as Input), {
    result: { facility: 5, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 41", () => {
  close(calculate({ priority: 41 } as Input), {
    result: { facility: 5, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 42", () => {
  close(calculate({ priority: 42 } as Input), {
    result: { facility: 5, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 43", () => {
  close(calculate({ priority: 43 } as Input), {
    result: { facility: 5, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 44", () => {
  close(calculate({ priority: 44 } as Input), {
    result: { facility: 5, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 45", () => {
  close(calculate({ priority: 45 } as Input), {
    result: { facility: 5, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 46", () => {
  close(calculate({ priority: 46 } as Input), {
    result: { facility: 5, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 47", () => {
  close(calculate({ priority: 47 } as Input), {
    result: { facility: 5, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 48", () => {
  close(calculate({ priority: 48 } as Input), {
    result: { facility: 6, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 49", () => {
  close(calculate({ priority: 49 } as Input), {
    result: { facility: 6, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 50", () => {
  close(calculate({ priority: 50 } as Input), {
    result: { facility: 6, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 51", () => {
  close(calculate({ priority: 51 } as Input), {
    result: { facility: 6, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 52", () => {
  close(calculate({ priority: 52 } as Input), {
    result: { facility: 6, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 53", () => {
  close(calculate({ priority: 53 } as Input), {
    result: { facility: 6, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 54", () => {
  close(calculate({ priority: 54 } as Input), {
    result: { facility: 6, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 55", () => {
  close(calculate({ priority: 55 } as Input), {
    result: { facility: 6, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 56", () => {
  close(calculate({ priority: 56 } as Input), {
    result: { facility: 7, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 57", () => {
  close(calculate({ priority: 57 } as Input), {
    result: { facility: 7, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 58", () => {
  close(calculate({ priority: 58 } as Input), {
    result: { facility: 7, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 59", () => {
  close(calculate({ priority: 59 } as Input), {
    result: { facility: 7, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 60", () => {
  close(calculate({ priority: 60 } as Input), {
    result: { facility: 7, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 61", () => {
  close(calculate({ priority: 61 } as Input), {
    result: { facility: 7, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 62", () => {
  close(calculate({ priority: 62 } as Input), {
    result: { facility: 7, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 63", () => {
  close(calculate({ priority: 63 } as Input), {
    result: { facility: 7, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 64", () => {
  close(calculate({ priority: 64 } as Input), {
    result: { facility: 8, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 65", () => {
  close(calculate({ priority: 65 } as Input), {
    result: { facility: 8, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 66", () => {
  close(calculate({ priority: 66 } as Input), {
    result: { facility: 8, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 67", () => {
  close(calculate({ priority: 67 } as Input), {
    result: { facility: 8, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 68", () => {
  close(calculate({ priority: 68 } as Input), {
    result: { facility: 8, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 69", () => {
  close(calculate({ priority: 69 } as Input), {
    result: { facility: 8, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 70", () => {
  close(calculate({ priority: 70 } as Input), {
    result: { facility: 8, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 71", () => {
  close(calculate({ priority: 71 } as Input), {
    result: { facility: 8, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 72", () => {
  close(calculate({ priority: 72 } as Input), {
    result: { facility: 9, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 73", () => {
  close(calculate({ priority: 73 } as Input), {
    result: { facility: 9, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 74", () => {
  close(calculate({ priority: 74 } as Input), {
    result: { facility: 9, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 75", () => {
  close(calculate({ priority: 75 } as Input), {
    result: { facility: 9, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 76", () => {
  close(calculate({ priority: 76 } as Input), {
    result: { facility: 9, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 77", () => {
  close(calculate({ priority: 77 } as Input), {
    result: { facility: 9, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 78", () => {
  close(calculate({ priority: 78 } as Input), {
    result: { facility: 9, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 79", () => {
  close(calculate({ priority: 79 } as Input), {
    result: { facility: 9, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 80", () => {
  close(calculate({ priority: 80 } as Input), {
    result: { facility: 10, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 81", () => {
  close(calculate({ priority: 81 } as Input), {
    result: { facility: 10, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 82", () => {
  close(calculate({ priority: 82 } as Input), {
    result: { facility: 10, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 83", () => {
  close(calculate({ priority: 83 } as Input), {
    result: { facility: 10, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 84", () => {
  close(calculate({ priority: 84 } as Input), {
    result: { facility: 10, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 85", () => {
  close(calculate({ priority: 85 } as Input), {
    result: { facility: 10, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 86", () => {
  close(calculate({ priority: 86 } as Input), {
    result: { facility: 10, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 87", () => {
  close(calculate({ priority: 87 } as Input), {
    result: { facility: 10, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 88", () => {
  close(calculate({ priority: 88 } as Input), {
    result: { facility: 11, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 89", () => {
  close(calculate({ priority: 89 } as Input), {
    result: { facility: 11, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 90", () => {
  close(calculate({ priority: 90 } as Input), {
    result: { facility: 11, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 91", () => {
  close(calculate({ priority: 91 } as Input), {
    result: { facility: 11, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 92", () => {
  close(calculate({ priority: 92 } as Input), {
    result: { facility: 11, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 93", () => {
  close(calculate({ priority: 93 } as Input), {
    result: { facility: 11, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 94", () => {
  close(calculate({ priority: 94 } as Input), {
    result: { facility: 11, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 95", () => {
  close(calculate({ priority: 95 } as Input), {
    result: { facility: 11, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 96", () => {
  close(calculate({ priority: 96 } as Input), {
    result: { facility: 12, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 97", () => {
  close(calculate({ priority: 97 } as Input), {
    result: { facility: 12, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 98", () => {
  close(calculate({ priority: 98 } as Input), {
    result: { facility: 12, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 99", () => {
  close(calculate({ priority: 99 } as Input), {
    result: { facility: 12, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 100", () => {
  close(calculate({ priority: 100 } as Input), {
    result: { facility: 12, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 101", () => {
  close(calculate({ priority: 101 } as Input), {
    result: { facility: 12, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 102", () => {
  close(calculate({ priority: 102 } as Input), {
    result: { facility: 12, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 103", () => {
  close(calculate({ priority: 103 } as Input), {
    result: { facility: 12, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 104", () => {
  close(calculate({ priority: 104 } as Input), {
    result: { facility: 13, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 105", () => {
  close(calculate({ priority: 105 } as Input), {
    result: { facility: 13, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 106", () => {
  close(calculate({ priority: 106 } as Input), {
    result: { facility: 13, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 107", () => {
  close(calculate({ priority: 107 } as Input), {
    result: { facility: 13, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 108", () => {
  close(calculate({ priority: 108 } as Input), {
    result: { facility: 13, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 109", () => {
  close(calculate({ priority: 109 } as Input), {
    result: { facility: 13, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 110", () => {
  close(calculate({ priority: 110 } as Input), {
    result: { facility: 13, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 111", () => {
  close(calculate({ priority: 111 } as Input), {
    result: { facility: 13, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 112", () => {
  close(calculate({ priority: 112 } as Input), {
    result: { facility: 14, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 113", () => {
  close(calculate({ priority: 113 } as Input), {
    result: { facility: 14, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 114", () => {
  close(calculate({ priority: 114 } as Input), {
    result: { facility: 14, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 115", () => {
  close(calculate({ priority: 115 } as Input), {
    result: { facility: 14, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 116", () => {
  close(calculate({ priority: 116 } as Input), {
    result: { facility: 14, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 117", () => {
  close(calculate({ priority: 117 } as Input), {
    result: { facility: 14, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 118", () => {
  close(calculate({ priority: 118 } as Input), {
    result: { facility: 14, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 119", () => {
  close(calculate({ priority: 119 } as Input), {
    result: { facility: 14, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 120", () => {
  close(calculate({ priority: 120 } as Input), {
    result: { facility: 15, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 121", () => {
  close(calculate({ priority: 121 } as Input), {
    result: { facility: 15, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 122", () => {
  close(calculate({ priority: 122 } as Input), {
    result: { facility: 15, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 123", () => {
  close(calculate({ priority: 123 } as Input), {
    result: { facility: 15, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 124", () => {
  close(calculate({ priority: 124 } as Input), {
    result: { facility: 15, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 125", () => {
  close(calculate({ priority: 125 } as Input), {
    result: { facility: 15, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 126", () => {
  close(calculate({ priority: 126 } as Input), {
    result: { facility: 15, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 127", () => {
  close(calculate({ priority: 127 } as Input), {
    result: { facility: 15, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 128", () => {
  close(calculate({ priority: 128 } as Input), {
    result: { facility: 16, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 129", () => {
  close(calculate({ priority: 129 } as Input), {
    result: { facility: 16, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 130", () => {
  close(calculate({ priority: 130 } as Input), {
    result: { facility: 16, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 131", () => {
  close(calculate({ priority: 131 } as Input), {
    result: { facility: 16, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 132", () => {
  close(calculate({ priority: 132 } as Input), {
    result: { facility: 16, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 133", () => {
  close(calculate({ priority: 133 } as Input), {
    result: { facility: 16, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 134", () => {
  close(calculate({ priority: 134 } as Input), {
    result: { facility: 16, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 135", () => {
  close(calculate({ priority: 135 } as Input), {
    result: { facility: 16, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 136", () => {
  close(calculate({ priority: 136 } as Input), {
    result: { facility: 17, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 137", () => {
  close(calculate({ priority: 137 } as Input), {
    result: { facility: 17, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 138", () => {
  close(calculate({ priority: 138 } as Input), {
    result: { facility: 17, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 139", () => {
  close(calculate({ priority: 139 } as Input), {
    result: { facility: 17, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 140", () => {
  close(calculate({ priority: 140 } as Input), {
    result: { facility: 17, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 141", () => {
  close(calculate({ priority: 141 } as Input), {
    result: { facility: 17, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 142", () => {
  close(calculate({ priority: 142 } as Input), {
    result: { facility: 17, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 143", () => {
  close(calculate({ priority: 143 } as Input), {
    result: { facility: 17, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 144", () => {
  close(calculate({ priority: 144 } as Input), {
    result: { facility: 18, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 145", () => {
  close(calculate({ priority: 145 } as Input), {
    result: { facility: 18, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 146", () => {
  close(calculate({ priority: 146 } as Input), {
    result: { facility: 18, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 147", () => {
  close(calculate({ priority: 147 } as Input), {
    result: { facility: 18, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 148", () => {
  close(calculate({ priority: 148 } as Input), {
    result: { facility: 18, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 149", () => {
  close(calculate({ priority: 149 } as Input), {
    result: { facility: 18, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 150", () => {
  close(calculate({ priority: 150 } as Input), {
    result: { facility: 18, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 151", () => {
  close(calculate({ priority: 151 } as Input), {
    result: { facility: 18, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 152", () => {
  close(calculate({ priority: 152 } as Input), {
    result: { facility: 19, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 153", () => {
  close(calculate({ priority: 153 } as Input), {
    result: { facility: 19, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 154", () => {
  close(calculate({ priority: 154 } as Input), {
    result: { facility: 19, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 155", () => {
  close(calculate({ priority: 155 } as Input), {
    result: { facility: 19, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 156", () => {
  close(calculate({ priority: 156 } as Input), {
    result: { facility: 19, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 157", () => {
  close(calculate({ priority: 157 } as Input), {
    result: { facility: 19, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 158", () => {
  close(calculate({ priority: 158 } as Input), {
    result: { facility: 19, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 159", () => {
  close(calculate({ priority: 159 } as Input), {
    result: { facility: 19, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 160", () => {
  close(calculate({ priority: 160 } as Input), {
    result: { facility: 20, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 161", () => {
  close(calculate({ priority: 161 } as Input), {
    result: { facility: 20, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 162", () => {
  close(calculate({ priority: 162 } as Input), {
    result: { facility: 20, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 163", () => {
  close(calculate({ priority: 163 } as Input), {
    result: { facility: 20, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 164", () => {
  close(calculate({ priority: 164 } as Input), {
    result: { facility: 20, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 165", () => {
  close(calculate({ priority: 165 } as Input), {
    result: { facility: 20, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 166", () => {
  close(calculate({ priority: 166 } as Input), {
    result: { facility: 20, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 167", () => {
  close(calculate({ priority: 167 } as Input), {
    result: { facility: 20, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 168", () => {
  close(calculate({ priority: 168 } as Input), {
    result: { facility: 21, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 169", () => {
  close(calculate({ priority: 169 } as Input), {
    result: { facility: 21, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 170", () => {
  close(calculate({ priority: 170 } as Input), {
    result: { facility: 21, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 171", () => {
  close(calculate({ priority: 171 } as Input), {
    result: { facility: 21, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 172", () => {
  close(calculate({ priority: 172 } as Input), {
    result: { facility: 21, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 173", () => {
  close(calculate({ priority: 173 } as Input), {
    result: { facility: 21, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 174", () => {
  close(calculate({ priority: 174 } as Input), {
    result: { facility: 21, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 175", () => {
  close(calculate({ priority: 175 } as Input), {
    result: { facility: 21, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 176", () => {
  close(calculate({ priority: 176 } as Input), {
    result: { facility: 22, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 177", () => {
  close(calculate({ priority: 177 } as Input), {
    result: { facility: 22, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 178", () => {
  close(calculate({ priority: 178 } as Input), {
    result: { facility: 22, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 179", () => {
  close(calculate({ priority: 179 } as Input), {
    result: { facility: 22, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 180", () => {
  close(calculate({ priority: 180 } as Input), {
    result: { facility: 22, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 181", () => {
  close(calculate({ priority: 181 } as Input), {
    result: { facility: 22, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 182", () => {
  close(calculate({ priority: 182 } as Input), {
    result: { facility: 22, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 183", () => {
  close(calculate({ priority: 183 } as Input), {
    result: { facility: 22, severity: 7 },
  });
}, 30000);
it("splits every valid syslog priority 184", () => {
  close(calculate({ priority: 184 } as Input), {
    result: { facility: 23, severity: 0 },
  });
}, 30000);
it("splits every valid syslog priority 185", () => {
  close(calculate({ priority: 185 } as Input), {
    result: { facility: 23, severity: 1 },
  });
}, 30000);
it("splits every valid syslog priority 186", () => {
  close(calculate({ priority: 186 } as Input), {
    result: { facility: 23, severity: 2 },
  });
}, 30000);
it("splits every valid syslog priority 187", () => {
  close(calculate({ priority: 187 } as Input), {
    result: { facility: 23, severity: 3 },
  });
}, 30000);
it("splits every valid syslog priority 188", () => {
  close(calculate({ priority: 188 } as Input), {
    result: { facility: 23, severity: 4 },
  });
}, 30000);
it("splits every valid syslog priority 189", () => {
  close(calculate({ priority: 189 } as Input), {
    result: { facility: 23, severity: 5 },
  });
}, 30000);
it("splits every valid syslog priority 190", () => {
  close(calculate({ priority: 190 } as Input), {
    result: { facility: 23, severity: 6 },
  });
}, 30000);
it("splits every valid syslog priority 191", () => {
  close(calculate({ priority: 191 } as Input), {
    result: { facility: 23, severity: 7 },
  });
}, 30000);
