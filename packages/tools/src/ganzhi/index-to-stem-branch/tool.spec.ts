import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { stemIndex: 9, branchIndex: 11 } };
const compare = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      1e-9 * Math.max(1, Math.abs(b)),
    );
  } else if (Array.isArray(b)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(b.length);
    b.forEach((x, j) => compare((a as unknown[])[j], x));
  } else if (b !== null && typeof b === "object") {
    expect(a !== null && typeof a === "object").toBe(true);
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(b).sort());
    for (const [k, v] of Object.entries(b))
      compare((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(b);
};
describe(tool.id, () => {
  it("matches the independently specified canonical answer", () =>
    compare(calculate(example.input), expected));
  it("executes with a schema-valid output", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, expected);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("rejects missing, inherited, accessor and extra fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    const key = Object.keys(example.input)[0],
      x = { ...example.input };
    Object.defineProperty(x, key, {
      get: () => {
        throw Error("must not invoke");
      },
      enumerable: true,
    });
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
  it("rejects null and wrong primitive types", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(() =>
        calculate({
          ...example.input,
          [k]: typeof v === "string" ? 1 : "bad",
        } as unknown as Input),
      ).toThrow();
    }
  });
  it("rejects nonfinite numbers and sparse lists", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const x of [NaN, Infinity, -Infinity])
          expect(tool.execute({ ...example.input, [k]: x })).toMatchObject({
            ok: false,
          });
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(2) } as unknown as Input),
        ).toThrow();
    }
  });
  it("enforces bounded strings and list evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "string")
        expect(() =>
          calculate({
            ...example.input,
            [k]: "x".repeat(8193),
          } as unknown as Input),
        ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({
            ...example.input,
            [k]: Array(129).fill(v[0]),
          } as unknown as Input),
        ).toThrow();
    }
  });
  it("is deterministic and preserves its inputs and published example", () => {
    const i = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(i);
    expect(calculate(i)).toEqual(calculate(i));
    expect(JSON.stringify(i)).toBe(s);
    compare(example.output, expected);
  });
  it("independent branch regression 1", () => {
    const i = { ordinal: 1 } as Input,
      w = { result: { stemIndex: 0, branchIndex: 0 } };
    compare(calculate(i), w);
    const r = tool.execute(i);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, w);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("rejects unsupported domain evidence 1", () => {
    const i = { ordinal: 0 } as unknown as Input;
    expect(() => calculate(i)).toThrow();
    expect(tool.execute(i)).toMatchObject({ ok: false });
  });
});

it("Independent reference fixtures 1", () => {
  const i = { ordinal: 1 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 2", () => {
  const i = { ordinal: 2 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 3", () => {
  const i = { ordinal: 3 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 4", () => {
  const i = { ordinal: 4 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 5", () => {
  const i = { ordinal: 5 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 6", () => {
  const i = { ordinal: 6 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 7", () => {
  const i = { ordinal: 7 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 8", () => {
  const i = { ordinal: 8 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 9", () => {
  const i = { ordinal: 9 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 10", () => {
  const i = { ordinal: 10 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 11", () => {
  const i = { ordinal: 11 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 12", () => {
  const i = { ordinal: 12 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 13", () => {
  const i = { ordinal: 13 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 14", () => {
  const i = { ordinal: 14 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 15", () => {
  const i = { ordinal: 15 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 16", () => {
  const i = { ordinal: 16 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 17", () => {
  const i = { ordinal: 17 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 18", () => {
  const i = { ordinal: 18 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 19", () => {
  const i = { ordinal: 19 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 20", () => {
  const i = { ordinal: 20 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 21", () => {
  const i = { ordinal: 21 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 22", () => {
  const i = { ordinal: 22 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 23", () => {
  const i = { ordinal: 23 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 24", () => {
  const i = { ordinal: 24 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 25", () => {
  const i = { ordinal: 25 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 26", () => {
  const i = { ordinal: 26 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 27", () => {
  const i = { ordinal: 27 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 28", () => {
  const i = { ordinal: 28 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 29", () => {
  const i = { ordinal: 29 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 30", () => {
  const i = { ordinal: 30 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 31", () => {
  const i = { ordinal: 31 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 32", () => {
  const i = { ordinal: 32 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 33", () => {
  const i = { ordinal: 33 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 34", () => {
  const i = { ordinal: 34 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 35", () => {
  const i = { ordinal: 35 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 36", () => {
  const i = { ordinal: 36 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 37", () => {
  const i = { ordinal: 37 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 38", () => {
  const i = { ordinal: 38 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 39", () => {
  const i = { ordinal: 39 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 40", () => {
  const i = { ordinal: 40 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 41", () => {
  const i = { ordinal: 41 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 42", () => {
  const i = { ordinal: 42 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 43", () => {
  const i = { ordinal: 43 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 44", () => {
  const i = { ordinal: 44 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 45", () => {
  const i = { ordinal: 45 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 46", () => {
  const i = { ordinal: 46 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 47", () => {
  const i = { ordinal: 47 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 48", () => {
  const i = { ordinal: 48 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 49", () => {
  const i = { ordinal: 49 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 50", () => {
  const i = { ordinal: 50 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 51", () => {
  const i = { ordinal: 51 } as unknown as Input,
    w = { result: { stemIndex: 0, branchIndex: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 52", () => {
  const i = { ordinal: 52 } as unknown as Input,
    w = { result: { stemIndex: 1, branchIndex: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 53", () => {
  const i = { ordinal: 53 } as unknown as Input,
    w = { result: { stemIndex: 2, branchIndex: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 54", () => {
  const i = { ordinal: 54 } as unknown as Input,
    w = { result: { stemIndex: 3, branchIndex: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 55", () => {
  const i = { ordinal: 55 } as unknown as Input,
    w = { result: { stemIndex: 4, branchIndex: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 56", () => {
  const i = { ordinal: 56 } as unknown as Input,
    w = { result: { stemIndex: 5, branchIndex: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 57", () => {
  const i = { ordinal: 57 } as unknown as Input,
    w = { result: { stemIndex: 6, branchIndex: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 58", () => {
  const i = { ordinal: 58 } as unknown as Input,
    w = { result: { stemIndex: 7, branchIndex: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 59", () => {
  const i = { ordinal: 59 } as unknown as Input,
    w = { result: { stemIndex: 8, branchIndex: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 60", () => {
  const i = { ordinal: 60 } as unknown as Input,
    w = { result: { stemIndex: 9, branchIndex: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});
