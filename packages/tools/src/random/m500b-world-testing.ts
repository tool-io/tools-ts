import { expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type { ToolResult } from "../core/result.js";
import type { WSeed, WMeta } from "./m500b-world-common.js";
export const worldLightweightSpecs = <I extends WSeed, O extends WMeta>(
  tool: ToolDefinition<I, O>,
  calculate: (v: unknown, c?: ToolExecutionContext) => ToolResult<O>,
  example: { readonly input: I; readonly output: O },
): void => {
  it("lightweight canonical direct and index runner contracts", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight replay immutability and seed precedence", () => {
    const clone = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(clone)).toEqual(tool.execute(example.input));
    expect(clone).toEqual(example.input);
    expect(
      tool.execute(clone, {
        random: () => {
          throw new Error("seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = clone;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    let draws = 0;
    const a = tool.execute(unseeded, {
      random: () => {
        draws += 1;
        return 0.25;
      },
    });
    if (!a.ok) throw new Error("Feasible context fixture was rejected.");
    expect(draws).toBeGreaterThan(0);
    expect(matchesToolJsonSchema(a.output, tool.outputSchema)).toBe(true);
    expect(a.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("lightweight required fields unknown properties and invalid source", () => {
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Required fields accepted.");
    expect(missing.error.issues).toHaveLength(
      tool.inputSchema.required?.length ?? 0,
    );
    expect(
      missing.error.issues.map((i) => ({ field: i.field, code: i.code })),
    ).toEqual(
      expect.arrayContaining(
        (tool.inputSchema.required ?? []).map((field) => ({
          field,
          code: "required_field",
        })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded, { random: () => NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    expect(tool.execute(unseeded, { random: () => 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    expect(
      tool.execute(unseeded, {
        random: () => {
          throw new Error("source failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
};
