import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrophysics/water-filled-pore-share", () => {
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
      tool.execute({
        waterVolume: 8,
        poreVolume: 10,
        inaccessiblePoreVolume: 4,
      }),
    ).toEqual({
      ok: true,
      output: {
        accessiblePoreVolume: 6,
        totalPoreShare: 0.8,
        accessiblePoreShare: 1.3333333333333333,
      },
    });
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterVolume",
    (value) =>
      expect(tool.execute({ ...example.input, waterVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite poreVolume", (value) =>
    expect(tool.execute({ ...example.input, poreVolume: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite inaccessiblePoreVolume",
    (value) =>
      expect(
        tool.execute({ ...example.input, inaccessiblePoreVolume: value }).ok,
      ).toBe(false),
  );
  it.each([
    { inaccessiblePoreVolume: 10 },
    { waterVolume: -1 },
    { poreVolume: 0 },
    { inaccessiblePoreVolume: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { inaccessiblePoreVolume: 10 },
    { waterVolume: -1 },
    { poreVolume: 0 },
    { inaccessiblePoreVolume: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("accessible and total-pore denominators remain distinct", () => {
    const output = calculate({
      waterVolume: 8,
      poreVolume: 10,
      inaccessiblePoreVolume: 4,
    });
    expect(output).toMatchObject({
      accessiblePoreVolume: 6,
      totalPoreShare: 0.8,
      accessiblePoreShare: 1.3333333333333333,
    });
    expect(
      tool.execute({
        waterVolume: 8,
        poreVolume: 10,
        inaccessiblePoreVolume: 4,
      }),
    ).toEqual({ ok: true, output });
  });
});
