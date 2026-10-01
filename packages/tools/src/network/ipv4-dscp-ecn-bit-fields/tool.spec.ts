import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { dscp: 46, ecn: 3 } };
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
    const i = { trafficClassByte: 0 } as Input,
      w = { result: { dscp: 0, ecn: 0 } };
    compare(calculate(i), w);
    const r = tool.execute(i);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, w);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("rejects unsupported domain evidence 1", () => {
    const i = { trafficClassByte: 256 } as unknown as Input;
    expect(() => calculate(i)).toThrow();
    expect(tool.execute(i)).toMatchObject({ ok: false });
  });
});

it("Independent reference fixtures 1", () => {
  const i = { trafficClassByte: 0 } as unknown as Input,
    w = { result: { dscp: 0, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 2", () => {
  const i = { trafficClassByte: 1 } as unknown as Input,
    w = { result: { dscp: 0, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 3", () => {
  const i = { trafficClassByte: 2 } as unknown as Input,
    w = { result: { dscp: 0, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 4", () => {
  const i = { trafficClassByte: 3 } as unknown as Input,
    w = { result: { dscp: 0, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 5", () => {
  const i = { trafficClassByte: 4 } as unknown as Input,
    w = { result: { dscp: 1, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 6", () => {
  const i = { trafficClassByte: 5 } as unknown as Input,
    w = { result: { dscp: 1, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 7", () => {
  const i = { trafficClassByte: 6 } as unknown as Input,
    w = { result: { dscp: 1, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 8", () => {
  const i = { trafficClassByte: 7 } as unknown as Input,
    w = { result: { dscp: 1, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 9", () => {
  const i = { trafficClassByte: 8 } as unknown as Input,
    w = { result: { dscp: 2, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 10", () => {
  const i = { trafficClassByte: 9 } as unknown as Input,
    w = { result: { dscp: 2, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 11", () => {
  const i = { trafficClassByte: 10 } as unknown as Input,
    w = { result: { dscp: 2, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 12", () => {
  const i = { trafficClassByte: 11 } as unknown as Input,
    w = { result: { dscp: 2, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 13", () => {
  const i = { trafficClassByte: 12 } as unknown as Input,
    w = { result: { dscp: 3, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 14", () => {
  const i = { trafficClassByte: 13 } as unknown as Input,
    w = { result: { dscp: 3, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 15", () => {
  const i = { trafficClassByte: 14 } as unknown as Input,
    w = { result: { dscp: 3, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 16", () => {
  const i = { trafficClassByte: 15 } as unknown as Input,
    w = { result: { dscp: 3, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 17", () => {
  const i = { trafficClassByte: 16 } as unknown as Input,
    w = { result: { dscp: 4, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 18", () => {
  const i = { trafficClassByte: 17 } as unknown as Input,
    w = { result: { dscp: 4, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 19", () => {
  const i = { trafficClassByte: 18 } as unknown as Input,
    w = { result: { dscp: 4, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 20", () => {
  const i = { trafficClassByte: 19 } as unknown as Input,
    w = { result: { dscp: 4, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 21", () => {
  const i = { trafficClassByte: 20 } as unknown as Input,
    w = { result: { dscp: 5, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 22", () => {
  const i = { trafficClassByte: 21 } as unknown as Input,
    w = { result: { dscp: 5, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 23", () => {
  const i = { trafficClassByte: 22 } as unknown as Input,
    w = { result: { dscp: 5, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 24", () => {
  const i = { trafficClassByte: 23 } as unknown as Input,
    w = { result: { dscp: 5, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 25", () => {
  const i = { trafficClassByte: 24 } as unknown as Input,
    w = { result: { dscp: 6, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 26", () => {
  const i = { trafficClassByte: 25 } as unknown as Input,
    w = { result: { dscp: 6, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 27", () => {
  const i = { trafficClassByte: 26 } as unknown as Input,
    w = { result: { dscp: 6, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 28", () => {
  const i = { trafficClassByte: 27 } as unknown as Input,
    w = { result: { dscp: 6, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 29", () => {
  const i = { trafficClassByte: 28 } as unknown as Input,
    w = { result: { dscp: 7, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 30", () => {
  const i = { trafficClassByte: 29 } as unknown as Input,
    w = { result: { dscp: 7, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 31", () => {
  const i = { trafficClassByte: 30 } as unknown as Input,
    w = { result: { dscp: 7, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 32", () => {
  const i = { trafficClassByte: 31 } as unknown as Input,
    w = { result: { dscp: 7, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 33", () => {
  const i = { trafficClassByte: 32 } as unknown as Input,
    w = { result: { dscp: 8, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 34", () => {
  const i = { trafficClassByte: 33 } as unknown as Input,
    w = { result: { dscp: 8, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 35", () => {
  const i = { trafficClassByte: 34 } as unknown as Input,
    w = { result: { dscp: 8, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 36", () => {
  const i = { trafficClassByte: 35 } as unknown as Input,
    w = { result: { dscp: 8, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 37", () => {
  const i = { trafficClassByte: 36 } as unknown as Input,
    w = { result: { dscp: 9, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 38", () => {
  const i = { trafficClassByte: 37 } as unknown as Input,
    w = { result: { dscp: 9, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 39", () => {
  const i = { trafficClassByte: 38 } as unknown as Input,
    w = { result: { dscp: 9, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 40", () => {
  const i = { trafficClassByte: 39 } as unknown as Input,
    w = { result: { dscp: 9, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 41", () => {
  const i = { trafficClassByte: 40 } as unknown as Input,
    w = { result: { dscp: 10, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 42", () => {
  const i = { trafficClassByte: 41 } as unknown as Input,
    w = { result: { dscp: 10, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 43", () => {
  const i = { trafficClassByte: 42 } as unknown as Input,
    w = { result: { dscp: 10, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 44", () => {
  const i = { trafficClassByte: 43 } as unknown as Input,
    w = { result: { dscp: 10, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 45", () => {
  const i = { trafficClassByte: 44 } as unknown as Input,
    w = { result: { dscp: 11, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 46", () => {
  const i = { trafficClassByte: 45 } as unknown as Input,
    w = { result: { dscp: 11, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 47", () => {
  const i = { trafficClassByte: 46 } as unknown as Input,
    w = { result: { dscp: 11, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 48", () => {
  const i = { trafficClassByte: 47 } as unknown as Input,
    w = { result: { dscp: 11, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 49", () => {
  const i = { trafficClassByte: 48 } as unknown as Input,
    w = { result: { dscp: 12, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 50", () => {
  const i = { trafficClassByte: 49 } as unknown as Input,
    w = { result: { dscp: 12, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 51", () => {
  const i = { trafficClassByte: 50 } as unknown as Input,
    w = { result: { dscp: 12, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 52", () => {
  const i = { trafficClassByte: 51 } as unknown as Input,
    w = { result: { dscp: 12, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 53", () => {
  const i = { trafficClassByte: 52 } as unknown as Input,
    w = { result: { dscp: 13, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 54", () => {
  const i = { trafficClassByte: 53 } as unknown as Input,
    w = { result: { dscp: 13, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 55", () => {
  const i = { trafficClassByte: 54 } as unknown as Input,
    w = { result: { dscp: 13, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 56", () => {
  const i = { trafficClassByte: 55 } as unknown as Input,
    w = { result: { dscp: 13, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 57", () => {
  const i = { trafficClassByte: 56 } as unknown as Input,
    w = { result: { dscp: 14, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 58", () => {
  const i = { trafficClassByte: 57 } as unknown as Input,
    w = { result: { dscp: 14, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 59", () => {
  const i = { trafficClassByte: 58 } as unknown as Input,
    w = { result: { dscp: 14, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 60", () => {
  const i = { trafficClassByte: 59 } as unknown as Input,
    w = { result: { dscp: 14, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 61", () => {
  const i = { trafficClassByte: 60 } as unknown as Input,
    w = { result: { dscp: 15, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 62", () => {
  const i = { trafficClassByte: 61 } as unknown as Input,
    w = { result: { dscp: 15, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 63", () => {
  const i = { trafficClassByte: 62 } as unknown as Input,
    w = { result: { dscp: 15, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 64", () => {
  const i = { trafficClassByte: 63 } as unknown as Input,
    w = { result: { dscp: 15, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 65", () => {
  const i = { trafficClassByte: 64 } as unknown as Input,
    w = { result: { dscp: 16, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 66", () => {
  const i = { trafficClassByte: 65 } as unknown as Input,
    w = { result: { dscp: 16, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 67", () => {
  const i = { trafficClassByte: 66 } as unknown as Input,
    w = { result: { dscp: 16, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 68", () => {
  const i = { trafficClassByte: 67 } as unknown as Input,
    w = { result: { dscp: 16, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 69", () => {
  const i = { trafficClassByte: 68 } as unknown as Input,
    w = { result: { dscp: 17, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 70", () => {
  const i = { trafficClassByte: 69 } as unknown as Input,
    w = { result: { dscp: 17, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 71", () => {
  const i = { trafficClassByte: 70 } as unknown as Input,
    w = { result: { dscp: 17, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 72", () => {
  const i = { trafficClassByte: 71 } as unknown as Input,
    w = { result: { dscp: 17, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 73", () => {
  const i = { trafficClassByte: 72 } as unknown as Input,
    w = { result: { dscp: 18, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 74", () => {
  const i = { trafficClassByte: 73 } as unknown as Input,
    w = { result: { dscp: 18, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 75", () => {
  const i = { trafficClassByte: 74 } as unknown as Input,
    w = { result: { dscp: 18, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 76", () => {
  const i = { trafficClassByte: 75 } as unknown as Input,
    w = { result: { dscp: 18, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 77", () => {
  const i = { trafficClassByte: 76 } as unknown as Input,
    w = { result: { dscp: 19, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 78", () => {
  const i = { trafficClassByte: 77 } as unknown as Input,
    w = { result: { dscp: 19, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 79", () => {
  const i = { trafficClassByte: 78 } as unknown as Input,
    w = { result: { dscp: 19, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 80", () => {
  const i = { trafficClassByte: 79 } as unknown as Input,
    w = { result: { dscp: 19, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 81", () => {
  const i = { trafficClassByte: 80 } as unknown as Input,
    w = { result: { dscp: 20, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 82", () => {
  const i = { trafficClassByte: 81 } as unknown as Input,
    w = { result: { dscp: 20, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 83", () => {
  const i = { trafficClassByte: 82 } as unknown as Input,
    w = { result: { dscp: 20, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 84", () => {
  const i = { trafficClassByte: 83 } as unknown as Input,
    w = { result: { dscp: 20, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 85", () => {
  const i = { trafficClassByte: 84 } as unknown as Input,
    w = { result: { dscp: 21, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 86", () => {
  const i = { trafficClassByte: 85 } as unknown as Input,
    w = { result: { dscp: 21, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 87", () => {
  const i = { trafficClassByte: 86 } as unknown as Input,
    w = { result: { dscp: 21, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 88", () => {
  const i = { trafficClassByte: 87 } as unknown as Input,
    w = { result: { dscp: 21, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 89", () => {
  const i = { trafficClassByte: 88 } as unknown as Input,
    w = { result: { dscp: 22, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 90", () => {
  const i = { trafficClassByte: 89 } as unknown as Input,
    w = { result: { dscp: 22, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 91", () => {
  const i = { trafficClassByte: 90 } as unknown as Input,
    w = { result: { dscp: 22, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 92", () => {
  const i = { trafficClassByte: 91 } as unknown as Input,
    w = { result: { dscp: 22, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 93", () => {
  const i = { trafficClassByte: 92 } as unknown as Input,
    w = { result: { dscp: 23, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 94", () => {
  const i = { trafficClassByte: 93 } as unknown as Input,
    w = { result: { dscp: 23, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 95", () => {
  const i = { trafficClassByte: 94 } as unknown as Input,
    w = { result: { dscp: 23, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 96", () => {
  const i = { trafficClassByte: 95 } as unknown as Input,
    w = { result: { dscp: 23, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 97", () => {
  const i = { trafficClassByte: 96 } as unknown as Input,
    w = { result: { dscp: 24, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 98", () => {
  const i = { trafficClassByte: 97 } as unknown as Input,
    w = { result: { dscp: 24, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 99", () => {
  const i = { trafficClassByte: 98 } as unknown as Input,
    w = { result: { dscp: 24, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 100", () => {
  const i = { trafficClassByte: 99 } as unknown as Input,
    w = { result: { dscp: 24, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 101", () => {
  const i = { trafficClassByte: 100 } as unknown as Input,
    w = { result: { dscp: 25, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 102", () => {
  const i = { trafficClassByte: 101 } as unknown as Input,
    w = { result: { dscp: 25, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 103", () => {
  const i = { trafficClassByte: 102 } as unknown as Input,
    w = { result: { dscp: 25, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 104", () => {
  const i = { trafficClassByte: 103 } as unknown as Input,
    w = { result: { dscp: 25, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 105", () => {
  const i = { trafficClassByte: 104 } as unknown as Input,
    w = { result: { dscp: 26, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 106", () => {
  const i = { trafficClassByte: 105 } as unknown as Input,
    w = { result: { dscp: 26, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 107", () => {
  const i = { trafficClassByte: 106 } as unknown as Input,
    w = { result: { dscp: 26, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 108", () => {
  const i = { trafficClassByte: 107 } as unknown as Input,
    w = { result: { dscp: 26, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 109", () => {
  const i = { trafficClassByte: 108 } as unknown as Input,
    w = { result: { dscp: 27, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 110", () => {
  const i = { trafficClassByte: 109 } as unknown as Input,
    w = { result: { dscp: 27, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 111", () => {
  const i = { trafficClassByte: 110 } as unknown as Input,
    w = { result: { dscp: 27, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 112", () => {
  const i = { trafficClassByte: 111 } as unknown as Input,
    w = { result: { dscp: 27, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 113", () => {
  const i = { trafficClassByte: 112 } as unknown as Input,
    w = { result: { dscp: 28, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 114", () => {
  const i = { trafficClassByte: 113 } as unknown as Input,
    w = { result: { dscp: 28, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 115", () => {
  const i = { trafficClassByte: 114 } as unknown as Input,
    w = { result: { dscp: 28, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 116", () => {
  const i = { trafficClassByte: 115 } as unknown as Input,
    w = { result: { dscp: 28, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 117", () => {
  const i = { trafficClassByte: 116 } as unknown as Input,
    w = { result: { dscp: 29, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 118", () => {
  const i = { trafficClassByte: 117 } as unknown as Input,
    w = { result: { dscp: 29, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 119", () => {
  const i = { trafficClassByte: 118 } as unknown as Input,
    w = { result: { dscp: 29, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 120", () => {
  const i = { trafficClassByte: 119 } as unknown as Input,
    w = { result: { dscp: 29, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 121", () => {
  const i = { trafficClassByte: 120 } as unknown as Input,
    w = { result: { dscp: 30, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 122", () => {
  const i = { trafficClassByte: 121 } as unknown as Input,
    w = { result: { dscp: 30, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 123", () => {
  const i = { trafficClassByte: 122 } as unknown as Input,
    w = { result: { dscp: 30, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 124", () => {
  const i = { trafficClassByte: 123 } as unknown as Input,
    w = { result: { dscp: 30, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 125", () => {
  const i = { trafficClassByte: 124 } as unknown as Input,
    w = { result: { dscp: 31, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 126", () => {
  const i = { trafficClassByte: 125 } as unknown as Input,
    w = { result: { dscp: 31, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 127", () => {
  const i = { trafficClassByte: 126 } as unknown as Input,
    w = { result: { dscp: 31, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 128", () => {
  const i = { trafficClassByte: 127 } as unknown as Input,
    w = { result: { dscp: 31, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 129", () => {
  const i = { trafficClassByte: 128 } as unknown as Input,
    w = { result: { dscp: 32, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 130", () => {
  const i = { trafficClassByte: 129 } as unknown as Input,
    w = { result: { dscp: 32, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 131", () => {
  const i = { trafficClassByte: 130 } as unknown as Input,
    w = { result: { dscp: 32, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 132", () => {
  const i = { trafficClassByte: 131 } as unknown as Input,
    w = { result: { dscp: 32, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 133", () => {
  const i = { trafficClassByte: 132 } as unknown as Input,
    w = { result: { dscp: 33, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 134", () => {
  const i = { trafficClassByte: 133 } as unknown as Input,
    w = { result: { dscp: 33, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 135", () => {
  const i = { trafficClassByte: 134 } as unknown as Input,
    w = { result: { dscp: 33, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 136", () => {
  const i = { trafficClassByte: 135 } as unknown as Input,
    w = { result: { dscp: 33, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 137", () => {
  const i = { trafficClassByte: 136 } as unknown as Input,
    w = { result: { dscp: 34, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 138", () => {
  const i = { trafficClassByte: 137 } as unknown as Input,
    w = { result: { dscp: 34, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 139", () => {
  const i = { trafficClassByte: 138 } as unknown as Input,
    w = { result: { dscp: 34, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 140", () => {
  const i = { trafficClassByte: 139 } as unknown as Input,
    w = { result: { dscp: 34, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 141", () => {
  const i = { trafficClassByte: 140 } as unknown as Input,
    w = { result: { dscp: 35, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 142", () => {
  const i = { trafficClassByte: 141 } as unknown as Input,
    w = { result: { dscp: 35, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 143", () => {
  const i = { trafficClassByte: 142 } as unknown as Input,
    w = { result: { dscp: 35, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 144", () => {
  const i = { trafficClassByte: 143 } as unknown as Input,
    w = { result: { dscp: 35, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 145", () => {
  const i = { trafficClassByte: 144 } as unknown as Input,
    w = { result: { dscp: 36, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 146", () => {
  const i = { trafficClassByte: 145 } as unknown as Input,
    w = { result: { dscp: 36, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 147", () => {
  const i = { trafficClassByte: 146 } as unknown as Input,
    w = { result: { dscp: 36, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 148", () => {
  const i = { trafficClassByte: 147 } as unknown as Input,
    w = { result: { dscp: 36, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 149", () => {
  const i = { trafficClassByte: 148 } as unknown as Input,
    w = { result: { dscp: 37, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 150", () => {
  const i = { trafficClassByte: 149 } as unknown as Input,
    w = { result: { dscp: 37, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 151", () => {
  const i = { trafficClassByte: 150 } as unknown as Input,
    w = { result: { dscp: 37, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 152", () => {
  const i = { trafficClassByte: 151 } as unknown as Input,
    w = { result: { dscp: 37, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 153", () => {
  const i = { trafficClassByte: 152 } as unknown as Input,
    w = { result: { dscp: 38, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 154", () => {
  const i = { trafficClassByte: 153 } as unknown as Input,
    w = { result: { dscp: 38, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 155", () => {
  const i = { trafficClassByte: 154 } as unknown as Input,
    w = { result: { dscp: 38, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 156", () => {
  const i = { trafficClassByte: 155 } as unknown as Input,
    w = { result: { dscp: 38, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 157", () => {
  const i = { trafficClassByte: 156 } as unknown as Input,
    w = { result: { dscp: 39, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 158", () => {
  const i = { trafficClassByte: 157 } as unknown as Input,
    w = { result: { dscp: 39, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 159", () => {
  const i = { trafficClassByte: 158 } as unknown as Input,
    w = { result: { dscp: 39, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 160", () => {
  const i = { trafficClassByte: 159 } as unknown as Input,
    w = { result: { dscp: 39, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 161", () => {
  const i = { trafficClassByte: 160 } as unknown as Input,
    w = { result: { dscp: 40, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 162", () => {
  const i = { trafficClassByte: 161 } as unknown as Input,
    w = { result: { dscp: 40, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 163", () => {
  const i = { trafficClassByte: 162 } as unknown as Input,
    w = { result: { dscp: 40, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 164", () => {
  const i = { trafficClassByte: 163 } as unknown as Input,
    w = { result: { dscp: 40, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 165", () => {
  const i = { trafficClassByte: 164 } as unknown as Input,
    w = { result: { dscp: 41, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 166", () => {
  const i = { trafficClassByte: 165 } as unknown as Input,
    w = { result: { dscp: 41, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 167", () => {
  const i = { trafficClassByte: 166 } as unknown as Input,
    w = { result: { dscp: 41, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 168", () => {
  const i = { trafficClassByte: 167 } as unknown as Input,
    w = { result: { dscp: 41, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 169", () => {
  const i = { trafficClassByte: 168 } as unknown as Input,
    w = { result: { dscp: 42, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 170", () => {
  const i = { trafficClassByte: 169 } as unknown as Input,
    w = { result: { dscp: 42, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 171", () => {
  const i = { trafficClassByte: 170 } as unknown as Input,
    w = { result: { dscp: 42, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 172", () => {
  const i = { trafficClassByte: 171 } as unknown as Input,
    w = { result: { dscp: 42, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 173", () => {
  const i = { trafficClassByte: 172 } as unknown as Input,
    w = { result: { dscp: 43, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 174", () => {
  const i = { trafficClassByte: 173 } as unknown as Input,
    w = { result: { dscp: 43, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 175", () => {
  const i = { trafficClassByte: 174 } as unknown as Input,
    w = { result: { dscp: 43, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 176", () => {
  const i = { trafficClassByte: 175 } as unknown as Input,
    w = { result: { dscp: 43, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 177", () => {
  const i = { trafficClassByte: 176 } as unknown as Input,
    w = { result: { dscp: 44, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 178", () => {
  const i = { trafficClassByte: 177 } as unknown as Input,
    w = { result: { dscp: 44, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 179", () => {
  const i = { trafficClassByte: 178 } as unknown as Input,
    w = { result: { dscp: 44, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 180", () => {
  const i = { trafficClassByte: 179 } as unknown as Input,
    w = { result: { dscp: 44, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 181", () => {
  const i = { trafficClassByte: 180 } as unknown as Input,
    w = { result: { dscp: 45, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 182", () => {
  const i = { trafficClassByte: 181 } as unknown as Input,
    w = { result: { dscp: 45, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 183", () => {
  const i = { trafficClassByte: 182 } as unknown as Input,
    w = { result: { dscp: 45, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 184", () => {
  const i = { trafficClassByte: 183 } as unknown as Input,
    w = { result: { dscp: 45, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 185", () => {
  const i = { trafficClassByte: 184 } as unknown as Input,
    w = { result: { dscp: 46, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 186", () => {
  const i = { trafficClassByte: 185 } as unknown as Input,
    w = { result: { dscp: 46, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 187", () => {
  const i = { trafficClassByte: 186 } as unknown as Input,
    w = { result: { dscp: 46, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 188", () => {
  const i = { trafficClassByte: 187 } as unknown as Input,
    w = { result: { dscp: 46, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 189", () => {
  const i = { trafficClassByte: 188 } as unknown as Input,
    w = { result: { dscp: 47, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 190", () => {
  const i = { trafficClassByte: 189 } as unknown as Input,
    w = { result: { dscp: 47, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 191", () => {
  const i = { trafficClassByte: 190 } as unknown as Input,
    w = { result: { dscp: 47, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 192", () => {
  const i = { trafficClassByte: 191 } as unknown as Input,
    w = { result: { dscp: 47, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 193", () => {
  const i = { trafficClassByte: 192 } as unknown as Input,
    w = { result: { dscp: 48, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 194", () => {
  const i = { trafficClassByte: 193 } as unknown as Input,
    w = { result: { dscp: 48, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 195", () => {
  const i = { trafficClassByte: 194 } as unknown as Input,
    w = { result: { dscp: 48, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 196", () => {
  const i = { trafficClassByte: 195 } as unknown as Input,
    w = { result: { dscp: 48, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 197", () => {
  const i = { trafficClassByte: 196 } as unknown as Input,
    w = { result: { dscp: 49, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 198", () => {
  const i = { trafficClassByte: 197 } as unknown as Input,
    w = { result: { dscp: 49, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 199", () => {
  const i = { trafficClassByte: 198 } as unknown as Input,
    w = { result: { dscp: 49, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 200", () => {
  const i = { trafficClassByte: 199 } as unknown as Input,
    w = { result: { dscp: 49, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 201", () => {
  const i = { trafficClassByte: 200 } as unknown as Input,
    w = { result: { dscp: 50, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 202", () => {
  const i = { trafficClassByte: 201 } as unknown as Input,
    w = { result: { dscp: 50, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 203", () => {
  const i = { trafficClassByte: 202 } as unknown as Input,
    w = { result: { dscp: 50, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 204", () => {
  const i = { trafficClassByte: 203 } as unknown as Input,
    w = { result: { dscp: 50, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 205", () => {
  const i = { trafficClassByte: 204 } as unknown as Input,
    w = { result: { dscp: 51, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 206", () => {
  const i = { trafficClassByte: 205 } as unknown as Input,
    w = { result: { dscp: 51, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 207", () => {
  const i = { trafficClassByte: 206 } as unknown as Input,
    w = { result: { dscp: 51, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 208", () => {
  const i = { trafficClassByte: 207 } as unknown as Input,
    w = { result: { dscp: 51, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 209", () => {
  const i = { trafficClassByte: 208 } as unknown as Input,
    w = { result: { dscp: 52, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 210", () => {
  const i = { trafficClassByte: 209 } as unknown as Input,
    w = { result: { dscp: 52, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 211", () => {
  const i = { trafficClassByte: 210 } as unknown as Input,
    w = { result: { dscp: 52, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 212", () => {
  const i = { trafficClassByte: 211 } as unknown as Input,
    w = { result: { dscp: 52, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 213", () => {
  const i = { trafficClassByte: 212 } as unknown as Input,
    w = { result: { dscp: 53, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 214", () => {
  const i = { trafficClassByte: 213 } as unknown as Input,
    w = { result: { dscp: 53, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 215", () => {
  const i = { trafficClassByte: 214 } as unknown as Input,
    w = { result: { dscp: 53, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 216", () => {
  const i = { trafficClassByte: 215 } as unknown as Input,
    w = { result: { dscp: 53, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 217", () => {
  const i = { trafficClassByte: 216 } as unknown as Input,
    w = { result: { dscp: 54, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 218", () => {
  const i = { trafficClassByte: 217 } as unknown as Input,
    w = { result: { dscp: 54, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 219", () => {
  const i = { trafficClassByte: 218 } as unknown as Input,
    w = { result: { dscp: 54, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 220", () => {
  const i = { trafficClassByte: 219 } as unknown as Input,
    w = { result: { dscp: 54, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 221", () => {
  const i = { trafficClassByte: 220 } as unknown as Input,
    w = { result: { dscp: 55, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 222", () => {
  const i = { trafficClassByte: 221 } as unknown as Input,
    w = { result: { dscp: 55, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 223", () => {
  const i = { trafficClassByte: 222 } as unknown as Input,
    w = { result: { dscp: 55, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 224", () => {
  const i = { trafficClassByte: 223 } as unknown as Input,
    w = { result: { dscp: 55, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 225", () => {
  const i = { trafficClassByte: 224 } as unknown as Input,
    w = { result: { dscp: 56, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 226", () => {
  const i = { trafficClassByte: 225 } as unknown as Input,
    w = { result: { dscp: 56, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 227", () => {
  const i = { trafficClassByte: 226 } as unknown as Input,
    w = { result: { dscp: 56, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 228", () => {
  const i = { trafficClassByte: 227 } as unknown as Input,
    w = { result: { dscp: 56, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 229", () => {
  const i = { trafficClassByte: 228 } as unknown as Input,
    w = { result: { dscp: 57, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 230", () => {
  const i = { trafficClassByte: 229 } as unknown as Input,
    w = { result: { dscp: 57, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 231", () => {
  const i = { trafficClassByte: 230 } as unknown as Input,
    w = { result: { dscp: 57, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 232", () => {
  const i = { trafficClassByte: 231 } as unknown as Input,
    w = { result: { dscp: 57, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 233", () => {
  const i = { trafficClassByte: 232 } as unknown as Input,
    w = { result: { dscp: 58, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 234", () => {
  const i = { trafficClassByte: 233 } as unknown as Input,
    w = { result: { dscp: 58, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 235", () => {
  const i = { trafficClassByte: 234 } as unknown as Input,
    w = { result: { dscp: 58, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 236", () => {
  const i = { trafficClassByte: 235 } as unknown as Input,
    w = { result: { dscp: 58, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 237", () => {
  const i = { trafficClassByte: 236 } as unknown as Input,
    w = { result: { dscp: 59, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 238", () => {
  const i = { trafficClassByte: 237 } as unknown as Input,
    w = { result: { dscp: 59, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 239", () => {
  const i = { trafficClassByte: 238 } as unknown as Input,
    w = { result: { dscp: 59, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 240", () => {
  const i = { trafficClassByte: 239 } as unknown as Input,
    w = { result: { dscp: 59, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 241", () => {
  const i = { trafficClassByte: 240 } as unknown as Input,
    w = { result: { dscp: 60, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 242", () => {
  const i = { trafficClassByte: 241 } as unknown as Input,
    w = { result: { dscp: 60, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 243", () => {
  const i = { trafficClassByte: 242 } as unknown as Input,
    w = { result: { dscp: 60, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 244", () => {
  const i = { trafficClassByte: 243 } as unknown as Input,
    w = { result: { dscp: 60, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 245", () => {
  const i = { trafficClassByte: 244 } as unknown as Input,
    w = { result: { dscp: 61, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 246", () => {
  const i = { trafficClassByte: 245 } as unknown as Input,
    w = { result: { dscp: 61, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 247", () => {
  const i = { trafficClassByte: 246 } as unknown as Input,
    w = { result: { dscp: 61, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 248", () => {
  const i = { trafficClassByte: 247 } as unknown as Input,
    w = { result: { dscp: 61, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 249", () => {
  const i = { trafficClassByte: 248 } as unknown as Input,
    w = { result: { dscp: 62, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 250", () => {
  const i = { trafficClassByte: 249 } as unknown as Input,
    w = { result: { dscp: 62, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 251", () => {
  const i = { trafficClassByte: 250 } as unknown as Input,
    w = { result: { dscp: 62, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 252", () => {
  const i = { trafficClassByte: 251 } as unknown as Input,
    w = { result: { dscp: 62, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 253", () => {
  const i = { trafficClassByte: 252 } as unknown as Input,
    w = { result: { dscp: 63, ecn: 0 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 254", () => {
  const i = { trafficClassByte: 253 } as unknown as Input,
    w = { result: { dscp: 63, ecn: 1 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 255", () => {
  const i = { trafficClassByte: 254 } as unknown as Input,
    w = { result: { dscp: 63, ecn: 2 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 256", () => {
  const i = { trafficClassByte: 255 } as unknown as Input,
    w = { result: { dscp: 63, ecn: 3 } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});
