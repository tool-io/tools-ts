import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("aquaculture/aquaculture-pump-head-loss-term", () => {
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
        staticHead: 1,
        frictionHead: 2,
        otherHead: 0,
        flow: 0.02,
        density: 1000,
        gravity: 10,
        efficiency: 0.75,
      }),
    ).toEqual({
      ok: true,
      output: { totalHead: 3, hydraulicPower: 600, inputPower: 800 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite staticHead", (value) =>
    expect(tool.execute({ ...example.input, staticHead: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite frictionHead",
    (value) =>
      expect(tool.execute({ ...example.input, frictionHead: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite otherHead", (value) =>
    expect(tool.execute({ ...example.input, otherHead: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite flow", (value) =>
    expect(tool.execute({ ...example.input, flow: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite density", (value) =>
    expect(tool.execute({ ...example.input, density: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite gravity", (value) =>
    expect(tool.execute({ ...example.input, gravity: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite efficiency", (value) =>
    expect(tool.execute({ ...example.input, efficiency: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { staticHead: -1 },
    { frictionHead: -1 },
    { otherHead: -1 },
    { flow: -1 },
    { density: 0 },
    { gravity: 0 },
    { efficiency: 0 },
    { efficiency: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
