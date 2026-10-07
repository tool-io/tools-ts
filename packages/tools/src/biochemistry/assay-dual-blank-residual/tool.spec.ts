import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biochemistry/assay-dual-blank-residual", () => {
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
      tool.execute({ sampleSignal: 10, reagentBlank: 8, matrixBlank: 5 }),
    ).toEqual({ ok: true, output: { correctedSignal: -3 } });
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
    "rejects nonfinite sampleSignal",
    (value) =>
      expect(tool.execute({ ...example.input, sampleSignal: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reagentBlank",
    (value) =>
      expect(tool.execute({ ...example.input, reagentBlank: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite matrixBlank",
    (value) =>
      expect(tool.execute({ ...example.input, matrixBlank: value }).ok).toBe(
        false,
      ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ sampleSignal: 5, reagentBlank: 3, matrixBlank: 4 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { correctedSignal: -2 },
    });
    expect(calculate(input)).toEqual({ correctedSignal: -2 });
  });
});
