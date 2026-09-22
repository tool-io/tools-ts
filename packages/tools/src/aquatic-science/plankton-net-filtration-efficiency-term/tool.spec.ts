import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("aquatic-science/plankton-net-filtration-efficiency-term", () => {
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
        mouthArea: 0.2,
        towDistance: 50,
        efficiency: 0.5,
        organisms: 100,
      }),
    ).toEqual({ ok: true, output: { filteredVolume: 5, density: 20 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite mouthArea", (value) =>
    expect(tool.execute({ ...example.input, mouthArea: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite towDistance",
    (value) =>
      expect(tool.execute({ ...example.input, towDistance: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite efficiency", (value) =>
    expect(tool.execute({ ...example.input, efficiency: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite organisms", (value) =>
    expect(tool.execute({ ...example.input, organisms: value }).ok).toBe(false),
  );
  it.each([
    { mouthArea: 0 },
    { towDistance: 0 },
    { efficiency: 0 },
    { efficiency: 2 },
    { organisms: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
