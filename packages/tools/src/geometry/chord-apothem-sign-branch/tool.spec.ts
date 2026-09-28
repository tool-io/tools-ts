import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geometry/chord-apothem-sign-branch", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({ radius: 5, chordLength: 6, positiveBranch: false }),
    ).toEqual({ ok: true, output: { signedApothem: -4 } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite radius", (value) =>
    expect(tool.execute({ ...example.input, radius: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite chordLength",
    (value) =>
      expect(tool.execute({ ...example.input, chordLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ radius: -1 }, { chordLength: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ radius: -1 }, { chordLength: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("a huge zero-length chord retains its finite radius", () => {
    const output = calculate({
      radius: 1e308,
      chordLength: 0,
      positiveBranch: true,
    });
    expect(output).toMatchObject({ signedApothem: 1e308 });
    expect(
      tool.execute({ radius: 1e308, chordLength: 0, positiveBranch: true }),
    ).toEqual({ ok: true, output });
  });
  it("a tiny zero-length chord does not underflow its apothem", () => {
    const output = calculate({
      radius: 1e-300,
      chordLength: 0,
      positiveBranch: false,
    });
    expect(output).toMatchObject({ signedApothem: -1e-300 });
    expect(
      tool.execute({ radius: 1e-300, chordLength: 0, positiveBranch: false }),
    ).toEqual({ ok: true, output });
  });
  it("a diameter chord has zero apothem", () => {
    const output = calculate({
      radius: 5,
      chordLength: 10,
      positiveBranch: false,
    });
    expect(output).toMatchObject({ signedApothem: 0 });
    expect(
      tool.execute({ radius: 5, chordLength: 10, positiveBranch: false }),
    ).toEqual({ ok: true, output });
  });
  it("matches the published radius-25 chord-48 example", () => {
    const output = calculate({
      radius: 25,
      chordLength: 48,
      positiveBranch: true,
    });
    expect(output).toMatchObject({ signedApothem: 7 });
    expect(
      tool.execute({ radius: 25, chordLength: 48, positiveBranch: true }),
    ).toEqual({ ok: true, output });
  });
});
