import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { codeUnits: [55357, 56832] } };
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
    const i = { codepoint: 65 } as Input,
      w = { result: { codeUnits: [65] } };
    compare(calculate(i), w);
    const r = tool.execute(i);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, w);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("rejects unsupported domain evidence 1", () => {
    const i = { codepoint: 55296 } as unknown as Input;
    expect(() => calculate(i)).toThrow();
    expect(tool.execute(i)).toMatchObject({ ok: false });
  });
});

it("Independent reference fixtures 1", () => {
  const i = { codepoint: 0 } as unknown as Input,
    w = { result: { codeUnits: [0] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 2", () => {
  const i = { codepoint: 1 } as unknown as Input,
    w = { result: { codeUnits: [1] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 3", () => {
  const i = { codepoint: 65 } as unknown as Input,
    w = { result: { codeUnits: [65] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 4", () => {
  const i = { codepoint: 127 } as unknown as Input,
    w = { result: { codeUnits: [127] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 5", () => {
  const i = { codepoint: 128 } as unknown as Input,
    w = { result: { codeUnits: [128] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 6", () => {
  const i = { codepoint: 2047 } as unknown as Input,
    w = { result: { codeUnits: [2047] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 7", () => {
  const i = { codepoint: 2048 } as unknown as Input,
    w = { result: { codeUnits: [2048] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 8", () => {
  const i = { codepoint: 55295 } as unknown as Input,
    w = { result: { codeUnits: [55295] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 9", () => {
  const i = { codepoint: 57344 } as unknown as Input,
    w = { result: { codeUnits: [57344] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 10", () => {
  const i = { codepoint: 64976 } as unknown as Input,
    w = { result: { codeUnits: [64976] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 11", () => {
  const i = { codepoint: 65535 } as unknown as Input,
    w = { result: { codeUnits: [65535] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 12", () => {
  const i = { codepoint: 65536 } as unknown as Input,
    w = { result: { codeUnits: [55296, 56320] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 13", () => {
  const i = { codepoint: 128512 } as unknown as Input,
    w = { result: { codeUnits: [55357, 56832] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 14", () => {
  const i = { codepoint: 1048573 } as unknown as Input,
    w = { result: { codeUnits: [56255, 57341] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 15", () => {
  const i = { codepoint: 1114109 } as unknown as Input,
    w = { result: { codeUnits: [56319, 57341] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 16", () => {
  const i = { codepoint: 1114111 } as unknown as Input,
    w = { result: { codeUnits: [56319, 57343] } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});
