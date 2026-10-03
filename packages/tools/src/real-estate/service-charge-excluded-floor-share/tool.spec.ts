import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("real-estate/service-charge-excluded-floor-share", () => {
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
        totalCost: 9000,
        tenantArea: 200,
        totalArea: 1000,
        excludedArea: 0,
      }),
    ).toEqual({
      ok: true,
      output: { eligibleArea: 1000, tenantFraction: 0.2, charge: 1800 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite totalCost", (value) =>
    expect(tool.execute({ ...example.input, totalCost: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite tenantArea", (value) =>
    expect(tool.execute({ ...example.input, tenantArea: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite totalArea", (value) =>
    expect(tool.execute({ ...example.input, totalArea: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite excludedArea",
    (value) =>
      expect(tool.execute({ ...example.input, excludedArea: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ totalCost: -1 }, { tenantArea: -1 }, { excludedArea: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
