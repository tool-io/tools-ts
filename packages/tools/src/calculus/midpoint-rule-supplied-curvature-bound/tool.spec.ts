import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("calculus/midpoint-rule-supplied-curvature-bound", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("matches its canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independently specified boundary or alternate case", () => {
    expect(
      tool.execute({ lower: 0, upper: 2, curvatureBound: 3, panels: 2 }),
    ).toEqual({ ok: true, output: { errorBound: 0.25 } });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, lower: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lower", (value) =>
    expect(tool.execute({ ...example.input, lower: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite upper", (value) =>
    expect(tool.execute({ ...example.input, upper: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite curvatureBound",
    (value) =>
      expect(tool.execute({ ...example.input, curvatureBound: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite panels", (value) =>
    expect(tool.execute({ ...example.input, panels: value }).ok).toBe(false),
  );
});

it("rejects explicit invalid domain and token boundary cases", () => {
  for (const change of [{ panels: 0 }, { curvatureBound: -1 }]) {
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues[0].code).toMatch(
        /invalid_|result_out_of_range/,
      );
    }
  }
});
