import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { packedOffset: 5 } };
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
    const i = { size: 4, row: 1, column: 2, includeDiagonal: false } as Input,
      w = { result: { packedOffset: 3 } };
    compare(calculate(i), w);
    const r = tool.execute(i);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, w);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("rejects unsupported domain evidence 1", () => {
    const i = {
      size: 4,
      row: 3,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input;
    expect(() => calculate(i)).toThrow();
    expect(tool.execute(i)).toMatchObject({ ok: false });
  });
});

it("Independent reference fixtures 1", () => {
  const i = {
      size: 1,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 2", () => {
  const i = {
      size: 2,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 3", () => {
  const i = {
      size: 2,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 4", () => {
  const i = {
      size: 2,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 5", () => {
  const i = {
      size: 2,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 6", () => {
  const i = {
      size: 3,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 7", () => {
  const i = {
      size: 3,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 8", () => {
  const i = {
      size: 3,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 9", () => {
  const i = {
      size: 3,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 10", () => {
  const i = {
      size: 3,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 11", () => {
  const i = {
      size: 3,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 12", () => {
  const i = {
      size: 3,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 13", () => {
  const i = {
      size: 3,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 14", () => {
  const i = {
      size: 3,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 15", () => {
  const i = {
      size: 4,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 16", () => {
  const i = {
      size: 4,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 17", () => {
  const i = {
      size: 4,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 18", () => {
  const i = {
      size: 4,
      row: 0,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 19", () => {
  const i = {
      size: 4,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 20", () => {
  const i = {
      size: 4,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 21", () => {
  const i = {
      size: 4,
      row: 1,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 22", () => {
  const i = {
      size: 4,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 23", () => {
  const i = {
      size: 4,
      row: 2,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 24", () => {
  const i = {
      size: 4,
      row: 3,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 25", () => {
  const i = {
      size: 4,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 26", () => {
  const i = {
      size: 4,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 27", () => {
  const i = {
      size: 4,
      row: 0,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 28", () => {
  const i = {
      size: 4,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 29", () => {
  const i = {
      size: 4,
      row: 1,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 30", () => {
  const i = {
      size: 4,
      row: 2,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 31", () => {
  const i = {
      size: 5,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 32", () => {
  const i = {
      size: 5,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 33", () => {
  const i = {
      size: 5,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 34", () => {
  const i = {
      size: 5,
      row: 0,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 35", () => {
  const i = {
      size: 5,
      row: 0,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 36", () => {
  const i = {
      size: 5,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 37", () => {
  const i = {
      size: 5,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 38", () => {
  const i = {
      size: 5,
      row: 1,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 39", () => {
  const i = {
      size: 5,
      row: 1,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 40", () => {
  const i = {
      size: 5,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 41", () => {
  const i = {
      size: 5,
      row: 2,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 42", () => {
  const i = {
      size: 5,
      row: 2,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 43", () => {
  const i = {
      size: 5,
      row: 3,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 44", () => {
  const i = {
      size: 5,
      row: 3,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 45", () => {
  const i = {
      size: 5,
      row: 4,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 46", () => {
  const i = {
      size: 5,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 47", () => {
  const i = {
      size: 5,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 48", () => {
  const i = {
      size: 5,
      row: 0,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 49", () => {
  const i = {
      size: 5,
      row: 0,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 50", () => {
  const i = {
      size: 5,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 51", () => {
  const i = {
      size: 5,
      row: 1,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 52", () => {
  const i = {
      size: 5,
      row: 1,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 53", () => {
  const i = {
      size: 5,
      row: 2,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 54", () => {
  const i = {
      size: 5,
      row: 2,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 55", () => {
  const i = {
      size: 5,
      row: 3,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 56", () => {
  const i = {
      size: 6,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 57", () => {
  const i = {
      size: 6,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 58", () => {
  const i = {
      size: 6,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 59", () => {
  const i = {
      size: 6,
      row: 0,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 60", () => {
  const i = {
      size: 6,
      row: 0,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 61", () => {
  const i = {
      size: 6,
      row: 0,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 62", () => {
  const i = {
      size: 6,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 63", () => {
  const i = {
      size: 6,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 64", () => {
  const i = {
      size: 6,
      row: 1,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 65", () => {
  const i = {
      size: 6,
      row: 1,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 66", () => {
  const i = {
      size: 6,
      row: 1,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 67", () => {
  const i = {
      size: 6,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 68", () => {
  const i = {
      size: 6,
      row: 2,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 69", () => {
  const i = {
      size: 6,
      row: 2,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 70", () => {
  const i = {
      size: 6,
      row: 2,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 71", () => {
  const i = {
      size: 6,
      row: 3,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 15 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 72", () => {
  const i = {
      size: 6,
      row: 3,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 16 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 73", () => {
  const i = {
      size: 6,
      row: 3,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 17 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 74", () => {
  const i = {
      size: 6,
      row: 4,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 18 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 75", () => {
  const i = {
      size: 6,
      row: 4,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 19 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 76", () => {
  const i = {
      size: 6,
      row: 5,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 20 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 77", () => {
  const i = {
      size: 6,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 78", () => {
  const i = {
      size: 6,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 79", () => {
  const i = {
      size: 6,
      row: 0,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 80", () => {
  const i = {
      size: 6,
      row: 0,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 81", () => {
  const i = {
      size: 6,
      row: 0,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 82", () => {
  const i = {
      size: 6,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 83", () => {
  const i = {
      size: 6,
      row: 1,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 84", () => {
  const i = {
      size: 6,
      row: 1,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 85", () => {
  const i = {
      size: 6,
      row: 1,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 86", () => {
  const i = {
      size: 6,
      row: 2,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 87", () => {
  const i = {
      size: 6,
      row: 2,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 88", () => {
  const i = {
      size: 6,
      row: 2,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 89", () => {
  const i = {
      size: 6,
      row: 3,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 90", () => {
  const i = {
      size: 6,
      row: 3,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 91", () => {
  const i = {
      size: 6,
      row: 4,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 92", () => {
  const i = {
      size: 7,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 93", () => {
  const i = {
      size: 7,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 94", () => {
  const i = {
      size: 7,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 95", () => {
  const i = {
      size: 7,
      row: 0,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 96", () => {
  const i = {
      size: 7,
      row: 0,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 97", () => {
  const i = {
      size: 7,
      row: 0,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 98", () => {
  const i = {
      size: 7,
      row: 0,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 99", () => {
  const i = {
      size: 7,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 100", () => {
  const i = {
      size: 7,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 101", () => {
  const i = {
      size: 7,
      row: 1,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 102", () => {
  const i = {
      size: 7,
      row: 1,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 103", () => {
  const i = {
      size: 7,
      row: 1,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 104", () => {
  const i = {
      size: 7,
      row: 1,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 105", () => {
  const i = {
      size: 7,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 106", () => {
  const i = {
      size: 7,
      row: 2,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 107", () => {
  const i = {
      size: 7,
      row: 2,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 15 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 108", () => {
  const i = {
      size: 7,
      row: 2,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 16 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 109", () => {
  const i = {
      size: 7,
      row: 2,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 17 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 110", () => {
  const i = {
      size: 7,
      row: 3,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 18 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 111", () => {
  const i = {
      size: 7,
      row: 3,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 19 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 112", () => {
  const i = {
      size: 7,
      row: 3,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 20 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 113", () => {
  const i = {
      size: 7,
      row: 3,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 21 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 114", () => {
  const i = {
      size: 7,
      row: 4,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 22 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 115", () => {
  const i = {
      size: 7,
      row: 4,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 23 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 116", () => {
  const i = {
      size: 7,
      row: 4,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 24 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 117", () => {
  const i = {
      size: 7,
      row: 5,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 25 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 118", () => {
  const i = {
      size: 7,
      row: 5,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 26 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 119", () => {
  const i = {
      size: 7,
      row: 6,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 27 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 120", () => {
  const i = {
      size: 7,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 121", () => {
  const i = {
      size: 7,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 122", () => {
  const i = {
      size: 7,
      row: 0,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 123", () => {
  const i = {
      size: 7,
      row: 0,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 124", () => {
  const i = {
      size: 7,
      row: 0,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 125", () => {
  const i = {
      size: 7,
      row: 0,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 126", () => {
  const i = {
      size: 7,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 127", () => {
  const i = {
      size: 7,
      row: 1,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 128", () => {
  const i = {
      size: 7,
      row: 1,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 129", () => {
  const i = {
      size: 7,
      row: 1,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 130", () => {
  const i = {
      size: 7,
      row: 1,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 131", () => {
  const i = {
      size: 7,
      row: 2,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 132", () => {
  const i = {
      size: 7,
      row: 2,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 133", () => {
  const i = {
      size: 7,
      row: 2,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 134", () => {
  const i = {
      size: 7,
      row: 2,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 135", () => {
  const i = {
      size: 7,
      row: 3,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 15 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 136", () => {
  const i = {
      size: 7,
      row: 3,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 16 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 137", () => {
  const i = {
      size: 7,
      row: 3,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 17 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 138", () => {
  const i = {
      size: 7,
      row: 4,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 18 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 139", () => {
  const i = {
      size: 7,
      row: 4,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 19 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 140", () => {
  const i = {
      size: 7,
      row: 5,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 20 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 141", () => {
  const i = {
      size: 8,
      row: 0,
      column: 0,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 142", () => {
  const i = {
      size: 8,
      row: 0,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 143", () => {
  const i = {
      size: 8,
      row: 0,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 144", () => {
  const i = {
      size: 8,
      row: 0,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 145", () => {
  const i = {
      size: 8,
      row: 0,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 146", () => {
  const i = {
      size: 8,
      row: 0,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 147", () => {
  const i = {
      size: 8,
      row: 0,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 148", () => {
  const i = {
      size: 8,
      row: 0,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 149", () => {
  const i = {
      size: 8,
      row: 1,
      column: 1,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 150", () => {
  const i = {
      size: 8,
      row: 1,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 151", () => {
  const i = {
      size: 8,
      row: 1,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 152", () => {
  const i = {
      size: 8,
      row: 1,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 153", () => {
  const i = {
      size: 8,
      row: 1,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 154", () => {
  const i = {
      size: 8,
      row: 1,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 155", () => {
  const i = {
      size: 8,
      row: 1,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 156", () => {
  const i = {
      size: 8,
      row: 2,
      column: 2,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 15 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 157", () => {
  const i = {
      size: 8,
      row: 2,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 16 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 158", () => {
  const i = {
      size: 8,
      row: 2,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 17 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 159", () => {
  const i = {
      size: 8,
      row: 2,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 18 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 160", () => {
  const i = {
      size: 8,
      row: 2,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 19 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 161", () => {
  const i = {
      size: 8,
      row: 2,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 20 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 162", () => {
  const i = {
      size: 8,
      row: 3,
      column: 3,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 21 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 163", () => {
  const i = {
      size: 8,
      row: 3,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 22 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 164", () => {
  const i = {
      size: 8,
      row: 3,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 23 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 165", () => {
  const i = {
      size: 8,
      row: 3,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 24 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 166", () => {
  const i = {
      size: 8,
      row: 3,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 25 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 167", () => {
  const i = {
      size: 8,
      row: 4,
      column: 4,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 26 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 168", () => {
  const i = {
      size: 8,
      row: 4,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 27 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 169", () => {
  const i = {
      size: 8,
      row: 4,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 28 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 170", () => {
  const i = {
      size: 8,
      row: 4,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 29 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 171", () => {
  const i = {
      size: 8,
      row: 5,
      column: 5,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 30 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 172", () => {
  const i = {
      size: 8,
      row: 5,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 31 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 173", () => {
  const i = {
      size: 8,
      row: 5,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 32 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 174", () => {
  const i = {
      size: 8,
      row: 6,
      column: 6,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 33 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 175", () => {
  const i = {
      size: 8,
      row: 6,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 34 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 176", () => {
  const i = {
      size: 8,
      row: 7,
      column: 7,
      includeDiagonal: true,
    } as unknown as Input,
    w = { result: { packedOffset: 35 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 177", () => {
  const i = {
      size: 8,
      row: 0,
      column: 1,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 178", () => {
  const i = {
      size: 8,
      row: 0,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 179", () => {
  const i = {
      size: 8,
      row: 0,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 180", () => {
  const i = {
      size: 8,
      row: 0,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 181", () => {
  const i = {
      size: 8,
      row: 0,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 4 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 182", () => {
  const i = {
      size: 8,
      row: 0,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 5 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 183", () => {
  const i = {
      size: 8,
      row: 0,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 6 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 184", () => {
  const i = {
      size: 8,
      row: 1,
      column: 2,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 7 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 185", () => {
  const i = {
      size: 8,
      row: 1,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 8 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 186", () => {
  const i = {
      size: 8,
      row: 1,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 9 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 187", () => {
  const i = {
      size: 8,
      row: 1,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 10 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 188", () => {
  const i = {
      size: 8,
      row: 1,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 11 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 189", () => {
  const i = {
      size: 8,
      row: 1,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 12 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 190", () => {
  const i = {
      size: 8,
      row: 2,
      column: 3,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 13 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 191", () => {
  const i = {
      size: 8,
      row: 2,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 14 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 192", () => {
  const i = {
      size: 8,
      row: 2,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 15 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 193", () => {
  const i = {
      size: 8,
      row: 2,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 16 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 194", () => {
  const i = {
      size: 8,
      row: 2,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 17 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 195", () => {
  const i = {
      size: 8,
      row: 3,
      column: 4,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 18 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 196", () => {
  const i = {
      size: 8,
      row: 3,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 19 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 197", () => {
  const i = {
      size: 8,
      row: 3,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 20 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 198", () => {
  const i = {
      size: 8,
      row: 3,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 21 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 199", () => {
  const i = {
      size: 8,
      row: 4,
      column: 5,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 22 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 200", () => {
  const i = {
      size: 8,
      row: 4,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 23 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 201", () => {
  const i = {
      size: 8,
      row: 4,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 24 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 202", () => {
  const i = {
      size: 8,
      row: 5,
      column: 6,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 25 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 203", () => {
  const i = {
      size: 8,
      row: 5,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 26 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 204", () => {
  const i = {
      size: 8,
      row: 6,
      column: 7,
      includeDiagonal: false,
    } as unknown as Input,
    w = { result: { packedOffset: 27 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});
