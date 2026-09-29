import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-business/bonded-stock-duty-suspension-balance", () => {
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
        openingUnits: 50,
        importedUnits: 20,
        exportedUnits: 30,
        domesticReleased: 10,
        destroyedUnits: 0,
        dutyPerUnit: 2,
      }),
    ).toEqual({ ok: true, output: { closingBonded: 30, dutyOnRelease: 20 } });
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
    "rejects nonfinite openingUnits",
    (value) =>
      expect(tool.execute({ ...example.input, openingUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite importedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, importedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite exportedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, exportedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite domesticReleased",
    (value) =>
      expect(
        tool.execute({ ...example.input, domesticReleased: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite destroyedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, destroyedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dutyPerUnit",
    (value) =>
      expect(tool.execute({ ...example.input, dutyPerUnit: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { openingUnits: -1 },
    { importedUnits: -1 },
    { exportedUnits: -1 },
    { domesticReleased: -1 },
    { destroyedUnits: -1 },
    { dutyPerUnit: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { openingUnits: -1 },
    { importedUnits: -1 },
    { exportedUnits: -1 },
    { domesticReleased: -1 },
    { destroyedUnits: -1 },
    { dutyPerUnit: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
