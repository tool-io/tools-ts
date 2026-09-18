import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { type: 9, channel: 2, dataBytes: 2 } };
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
it("splits every MIDI channel status 128", () => {
  close(calculate({ status: 128 } as Input), {
    result: { type: 8, channel: 0, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 129", () => {
  close(calculate({ status: 129 } as Input), {
    result: { type: 8, channel: 1, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 130", () => {
  close(calculate({ status: 130 } as Input), {
    result: { type: 8, channel: 2, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 131", () => {
  close(calculate({ status: 131 } as Input), {
    result: { type: 8, channel: 3, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 132", () => {
  close(calculate({ status: 132 } as Input), {
    result: { type: 8, channel: 4, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 133", () => {
  close(calculate({ status: 133 } as Input), {
    result: { type: 8, channel: 5, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 134", () => {
  close(calculate({ status: 134 } as Input), {
    result: { type: 8, channel: 6, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 135", () => {
  close(calculate({ status: 135 } as Input), {
    result: { type: 8, channel: 7, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 136", () => {
  close(calculate({ status: 136 } as Input), {
    result: { type: 8, channel: 8, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 137", () => {
  close(calculate({ status: 137 } as Input), {
    result: { type: 8, channel: 9, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 138", () => {
  close(calculate({ status: 138 } as Input), {
    result: { type: 8, channel: 10, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 139", () => {
  close(calculate({ status: 139 } as Input), {
    result: { type: 8, channel: 11, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 140", () => {
  close(calculate({ status: 140 } as Input), {
    result: { type: 8, channel: 12, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 141", () => {
  close(calculate({ status: 141 } as Input), {
    result: { type: 8, channel: 13, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 142", () => {
  close(calculate({ status: 142 } as Input), {
    result: { type: 8, channel: 14, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 143", () => {
  close(calculate({ status: 143 } as Input), {
    result: { type: 8, channel: 15, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 144", () => {
  close(calculate({ status: 144 } as Input), {
    result: { type: 9, channel: 0, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 145", () => {
  close(calculate({ status: 145 } as Input), {
    result: { type: 9, channel: 1, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 146", () => {
  close(calculate({ status: 146 } as Input), {
    result: { type: 9, channel: 2, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 147", () => {
  close(calculate({ status: 147 } as Input), {
    result: { type: 9, channel: 3, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 148", () => {
  close(calculate({ status: 148 } as Input), {
    result: { type: 9, channel: 4, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 149", () => {
  close(calculate({ status: 149 } as Input), {
    result: { type: 9, channel: 5, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 150", () => {
  close(calculate({ status: 150 } as Input), {
    result: { type: 9, channel: 6, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 151", () => {
  close(calculate({ status: 151 } as Input), {
    result: { type: 9, channel: 7, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 152", () => {
  close(calculate({ status: 152 } as Input), {
    result: { type: 9, channel: 8, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 153", () => {
  close(calculate({ status: 153 } as Input), {
    result: { type: 9, channel: 9, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 154", () => {
  close(calculate({ status: 154 } as Input), {
    result: { type: 9, channel: 10, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 155", () => {
  close(calculate({ status: 155 } as Input), {
    result: { type: 9, channel: 11, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 156", () => {
  close(calculate({ status: 156 } as Input), {
    result: { type: 9, channel: 12, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 157", () => {
  close(calculate({ status: 157 } as Input), {
    result: { type: 9, channel: 13, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 158", () => {
  close(calculate({ status: 158 } as Input), {
    result: { type: 9, channel: 14, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 159", () => {
  close(calculate({ status: 159 } as Input), {
    result: { type: 9, channel: 15, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 160", () => {
  close(calculate({ status: 160 } as Input), {
    result: { type: 10, channel: 0, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 161", () => {
  close(calculate({ status: 161 } as Input), {
    result: { type: 10, channel: 1, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 162", () => {
  close(calculate({ status: 162 } as Input), {
    result: { type: 10, channel: 2, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 163", () => {
  close(calculate({ status: 163 } as Input), {
    result: { type: 10, channel: 3, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 164", () => {
  close(calculate({ status: 164 } as Input), {
    result: { type: 10, channel: 4, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 165", () => {
  close(calculate({ status: 165 } as Input), {
    result: { type: 10, channel: 5, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 166", () => {
  close(calculate({ status: 166 } as Input), {
    result: { type: 10, channel: 6, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 167", () => {
  close(calculate({ status: 167 } as Input), {
    result: { type: 10, channel: 7, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 168", () => {
  close(calculate({ status: 168 } as Input), {
    result: { type: 10, channel: 8, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 169", () => {
  close(calculate({ status: 169 } as Input), {
    result: { type: 10, channel: 9, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 170", () => {
  close(calculate({ status: 170 } as Input), {
    result: { type: 10, channel: 10, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 171", () => {
  close(calculate({ status: 171 } as Input), {
    result: { type: 10, channel: 11, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 172", () => {
  close(calculate({ status: 172 } as Input), {
    result: { type: 10, channel: 12, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 173", () => {
  close(calculate({ status: 173 } as Input), {
    result: { type: 10, channel: 13, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 174", () => {
  close(calculate({ status: 174 } as Input), {
    result: { type: 10, channel: 14, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 175", () => {
  close(calculate({ status: 175 } as Input), {
    result: { type: 10, channel: 15, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 176", () => {
  close(calculate({ status: 176 } as Input), {
    result: { type: 11, channel: 0, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 177", () => {
  close(calculate({ status: 177 } as Input), {
    result: { type: 11, channel: 1, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 178", () => {
  close(calculate({ status: 178 } as Input), {
    result: { type: 11, channel: 2, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 179", () => {
  close(calculate({ status: 179 } as Input), {
    result: { type: 11, channel: 3, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 180", () => {
  close(calculate({ status: 180 } as Input), {
    result: { type: 11, channel: 4, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 181", () => {
  close(calculate({ status: 181 } as Input), {
    result: { type: 11, channel: 5, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 182", () => {
  close(calculate({ status: 182 } as Input), {
    result: { type: 11, channel: 6, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 183", () => {
  close(calculate({ status: 183 } as Input), {
    result: { type: 11, channel: 7, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 184", () => {
  close(calculate({ status: 184 } as Input), {
    result: { type: 11, channel: 8, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 185", () => {
  close(calculate({ status: 185 } as Input), {
    result: { type: 11, channel: 9, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 186", () => {
  close(calculate({ status: 186 } as Input), {
    result: { type: 11, channel: 10, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 187", () => {
  close(calculate({ status: 187 } as Input), {
    result: { type: 11, channel: 11, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 188", () => {
  close(calculate({ status: 188 } as Input), {
    result: { type: 11, channel: 12, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 189", () => {
  close(calculate({ status: 189 } as Input), {
    result: { type: 11, channel: 13, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 190", () => {
  close(calculate({ status: 190 } as Input), {
    result: { type: 11, channel: 14, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 191", () => {
  close(calculate({ status: 191 } as Input), {
    result: { type: 11, channel: 15, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 192", () => {
  close(calculate({ status: 192 } as Input), {
    result: { type: 12, channel: 0, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 193", () => {
  close(calculate({ status: 193 } as Input), {
    result: { type: 12, channel: 1, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 194", () => {
  close(calculate({ status: 194 } as Input), {
    result: { type: 12, channel: 2, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 195", () => {
  close(calculate({ status: 195 } as Input), {
    result: { type: 12, channel: 3, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 196", () => {
  close(calculate({ status: 196 } as Input), {
    result: { type: 12, channel: 4, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 197", () => {
  close(calculate({ status: 197 } as Input), {
    result: { type: 12, channel: 5, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 198", () => {
  close(calculate({ status: 198 } as Input), {
    result: { type: 12, channel: 6, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 199", () => {
  close(calculate({ status: 199 } as Input), {
    result: { type: 12, channel: 7, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 200", () => {
  close(calculate({ status: 200 } as Input), {
    result: { type: 12, channel: 8, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 201", () => {
  close(calculate({ status: 201 } as Input), {
    result: { type: 12, channel: 9, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 202", () => {
  close(calculate({ status: 202 } as Input), {
    result: { type: 12, channel: 10, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 203", () => {
  close(calculate({ status: 203 } as Input), {
    result: { type: 12, channel: 11, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 204", () => {
  close(calculate({ status: 204 } as Input), {
    result: { type: 12, channel: 12, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 205", () => {
  close(calculate({ status: 205 } as Input), {
    result: { type: 12, channel: 13, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 206", () => {
  close(calculate({ status: 206 } as Input), {
    result: { type: 12, channel: 14, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 207", () => {
  close(calculate({ status: 207 } as Input), {
    result: { type: 12, channel: 15, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 208", () => {
  close(calculate({ status: 208 } as Input), {
    result: { type: 13, channel: 0, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 209", () => {
  close(calculate({ status: 209 } as Input), {
    result: { type: 13, channel: 1, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 210", () => {
  close(calculate({ status: 210 } as Input), {
    result: { type: 13, channel: 2, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 211", () => {
  close(calculate({ status: 211 } as Input), {
    result: { type: 13, channel: 3, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 212", () => {
  close(calculate({ status: 212 } as Input), {
    result: { type: 13, channel: 4, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 213", () => {
  close(calculate({ status: 213 } as Input), {
    result: { type: 13, channel: 5, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 214", () => {
  close(calculate({ status: 214 } as Input), {
    result: { type: 13, channel: 6, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 215", () => {
  close(calculate({ status: 215 } as Input), {
    result: { type: 13, channel: 7, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 216", () => {
  close(calculate({ status: 216 } as Input), {
    result: { type: 13, channel: 8, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 217", () => {
  close(calculate({ status: 217 } as Input), {
    result: { type: 13, channel: 9, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 218", () => {
  close(calculate({ status: 218 } as Input), {
    result: { type: 13, channel: 10, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 219", () => {
  close(calculate({ status: 219 } as Input), {
    result: { type: 13, channel: 11, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 220", () => {
  close(calculate({ status: 220 } as Input), {
    result: { type: 13, channel: 12, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 221", () => {
  close(calculate({ status: 221 } as Input), {
    result: { type: 13, channel: 13, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 222", () => {
  close(calculate({ status: 222 } as Input), {
    result: { type: 13, channel: 14, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 223", () => {
  close(calculate({ status: 223 } as Input), {
    result: { type: 13, channel: 15, dataBytes: 1 },
  });
}, 30000);
it("splits every MIDI channel status 224", () => {
  close(calculate({ status: 224 } as Input), {
    result: { type: 14, channel: 0, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 225", () => {
  close(calculate({ status: 225 } as Input), {
    result: { type: 14, channel: 1, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 226", () => {
  close(calculate({ status: 226 } as Input), {
    result: { type: 14, channel: 2, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 227", () => {
  close(calculate({ status: 227 } as Input), {
    result: { type: 14, channel: 3, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 228", () => {
  close(calculate({ status: 228 } as Input), {
    result: { type: 14, channel: 4, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 229", () => {
  close(calculate({ status: 229 } as Input), {
    result: { type: 14, channel: 5, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 230", () => {
  close(calculate({ status: 230 } as Input), {
    result: { type: 14, channel: 6, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 231", () => {
  close(calculate({ status: 231 } as Input), {
    result: { type: 14, channel: 7, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 232", () => {
  close(calculate({ status: 232 } as Input), {
    result: { type: 14, channel: 8, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 233", () => {
  close(calculate({ status: 233 } as Input), {
    result: { type: 14, channel: 9, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 234", () => {
  close(calculate({ status: 234 } as Input), {
    result: { type: 14, channel: 10, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 235", () => {
  close(calculate({ status: 235 } as Input), {
    result: { type: 14, channel: 11, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 236", () => {
  close(calculate({ status: 236 } as Input), {
    result: { type: 14, channel: 12, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 237", () => {
  close(calculate({ status: 237 } as Input), {
    result: { type: 14, channel: 13, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 238", () => {
  close(calculate({ status: 238 } as Input), {
    result: { type: 14, channel: 14, dataBytes: 2 },
  });
}, 30000);
it("splits every MIDI channel status 239", () => {
  close(calculate({ status: 239 } as Input), {
    result: { type: 14, channel: 15, dataBytes: 2 },
  });
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = { status: 0 } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = { status: 127 } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = { status: 240 } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = { status: 255 } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
