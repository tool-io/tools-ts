import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: { wrapped: "128", unsignedCarry: false, signedOverflow: true },
};
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
    const i = { left: "255", right: "1", width: 8 } as Input,
      w = {
        result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
      };
    compare(calculate(i), w);
    const r = tool.execute(i);
    expect(r.ok).toBe(true);
    if (r.ok) {
      compare(r.output, w);
      expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
    }
  });
  it("rejects unsupported domain evidence 1", () => {
    const i = { left: "256", right: "1", width: 8 } as unknown as Input;
    expect(() => calculate(i)).toThrow();
    expect(tool.execute(i)).toMatchObject({ ok: false });
  });
});

it("Independent reference fixtures 1", () => {
  const i = { left: "0", right: "0", width: 1 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 2", () => {
  const i = { left: "1", right: "1", width: 1 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 3", () => {
  const i = { left: "0", right: "1", width: 1 } as unknown as Input,
    w = {
      result: { wrapped: "1", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 4", () => {
  const i = { left: "1", right: "1", width: 1 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 5", () => {
  const i = { left: "0", right: "0", width: 2 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 6", () => {
  const i = { left: "3", right: "1", width: 2 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 7", () => {
  const i = { left: "1", right: "1", width: 2 } as unknown as Input,
    w = {
      result: { wrapped: "2", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 8", () => {
  const i = { left: "2", right: "2", width: 2 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 9", () => {
  const i = { left: "0", right: "0", width: 3 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 10", () => {
  const i = { left: "7", right: "1", width: 3 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 11", () => {
  const i = { left: "3", right: "1", width: 3 } as unknown as Input,
    w = {
      result: { wrapped: "4", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 12", () => {
  const i = { left: "4", right: "4", width: 3 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 13", () => {
  const i = { left: "0", right: "0", width: 4 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 14", () => {
  const i = { left: "15", right: "1", width: 4 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 15", () => {
  const i = { left: "7", right: "1", width: 4 } as unknown as Input,
    w = {
      result: { wrapped: "8", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 16", () => {
  const i = { left: "8", right: "8", width: 4 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 17", () => {
  const i = { left: "0", right: "0", width: 5 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 18", () => {
  const i = { left: "31", right: "1", width: 5 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 19", () => {
  const i = { left: "15", right: "1", width: 5 } as unknown as Input,
    w = {
      result: { wrapped: "16", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 20", () => {
  const i = { left: "16", right: "16", width: 5 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 21", () => {
  const i = { left: "0", right: "0", width: 6 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 22", () => {
  const i = { left: "63", right: "1", width: 6 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 23", () => {
  const i = { left: "31", right: "1", width: 6 } as unknown as Input,
    w = {
      result: { wrapped: "32", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 24", () => {
  const i = { left: "32", right: "32", width: 6 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 25", () => {
  const i = { left: "0", right: "0", width: 7 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 26", () => {
  const i = { left: "127", right: "1", width: 7 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 27", () => {
  const i = { left: "63", right: "1", width: 7 } as unknown as Input,
    w = {
      result: { wrapped: "64", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 28", () => {
  const i = { left: "64", right: "64", width: 7 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 29", () => {
  const i = { left: "0", right: "0", width: 8 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 30", () => {
  const i = { left: "255", right: "1", width: 8 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 31", () => {
  const i = { left: "127", right: "1", width: 8 } as unknown as Input,
    w = {
      result: { wrapped: "128", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 32", () => {
  const i = { left: "128", right: "128", width: 8 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 33", () => {
  const i = { left: "0", right: "0", width: 9 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 34", () => {
  const i = { left: "511", right: "1", width: 9 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 35", () => {
  const i = { left: "255", right: "1", width: 9 } as unknown as Input,
    w = {
      result: { wrapped: "256", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 36", () => {
  const i = { left: "256", right: "256", width: 9 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 37", () => {
  const i = { left: "0", right: "0", width: 10 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 38", () => {
  const i = { left: "1023", right: "1", width: 10 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 39", () => {
  const i = { left: "511", right: "1", width: 10 } as unknown as Input,
    w = {
      result: { wrapped: "512", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 40", () => {
  const i = { left: "512", right: "512", width: 10 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 41", () => {
  const i = { left: "0", right: "0", width: 11 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 42", () => {
  const i = { left: "2047", right: "1", width: 11 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 43", () => {
  const i = { left: "1023", right: "1", width: 11 } as unknown as Input,
    w = {
      result: { wrapped: "1024", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 44", () => {
  const i = { left: "1024", right: "1024", width: 11 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 45", () => {
  const i = { left: "0", right: "0", width: 12 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 46", () => {
  const i = { left: "4095", right: "1", width: 12 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 47", () => {
  const i = { left: "2047", right: "1", width: 12 } as unknown as Input,
    w = {
      result: { wrapped: "2048", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 48", () => {
  const i = { left: "2048", right: "2048", width: 12 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 49", () => {
  const i = { left: "0", right: "0", width: 13 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 50", () => {
  const i = { left: "8191", right: "1", width: 13 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 51", () => {
  const i = { left: "4095", right: "1", width: 13 } as unknown as Input,
    w = {
      result: { wrapped: "4096", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 52", () => {
  const i = { left: "4096", right: "4096", width: 13 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 53", () => {
  const i = { left: "0", right: "0", width: 14 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 54", () => {
  const i = { left: "16383", right: "1", width: 14 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 55", () => {
  const i = { left: "8191", right: "1", width: 14 } as unknown as Input,
    w = {
      result: { wrapped: "8192", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 56", () => {
  const i = { left: "8192", right: "8192", width: 14 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 57", () => {
  const i = { left: "0", right: "0", width: 15 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 58", () => {
  const i = { left: "32767", right: "1", width: 15 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 59", () => {
  const i = { left: "16383", right: "1", width: 15 } as unknown as Input,
    w = {
      result: { wrapped: "16384", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 60", () => {
  const i = { left: "16384", right: "16384", width: 15 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 61", () => {
  const i = { left: "0", right: "0", width: 16 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: false, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 62", () => {
  const i = { left: "65535", right: "1", width: 16 } as unknown as Input,
    w = {
      result: { wrapped: "0", unsignedCarry: true, signedOverflow: false },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 63", () => {
  const i = { left: "32767", right: "1", width: 16 } as unknown as Input,
    w = {
      result: { wrapped: "32768", unsignedCarry: false, signedOverflow: true },
    };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});

it("Independent reference fixtures 64", () => {
  const i = { left: "32768", right: "32768", width: 16 } as unknown as Input,
    w = { result: { wrapped: "0", unsignedCarry: true, signedOverflow: true } };
  compare(calculate(i), w);
  const r = tool.execute(i);
  expect(r.ok).toBe(true);
  if (r.ok) {
    compare(r.output, w);
    expect(matchesToolJsonSchema(r.output, tool.outputSchema)).toBe(true);
  }
});
