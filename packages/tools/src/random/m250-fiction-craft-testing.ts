import { describe, expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import type { ToolResult } from "../core/result.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type { FcSeed } from "./m250-fiction-craft-common.js";

export const fictionCraftContractTests = <I extends FcSeed, O>(
  tool: ToolDefinition<I, O>,
  calculate: (input: unknown, context?: ToolExecutionContext) => ToolResult<O>,
  example: { readonly input: I; readonly output: O },
): void => {
  describe(tool.id + " portable behavior", () => {
    it("publishes concrete ports and an independently authored literal fixture", () => {
      expect(validateToolContract(tool)).toEqual([]);
      expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
      expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(
        true,
      );
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
    it("replays, preserves inputs and gives explicit seeds precedence", () => {
      const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input;
      expect(tool.execute(input)).toEqual(tool.execute(example.input));
      expect(input).toEqual(example.input);
      expect(
        tool.execute(input, {
          random: () => {
            throw new Error("seed wins");
          },
        }),
      ).toEqual({ ok: true, output: example.output });
      const { seed, ...unseeded } = input;
      expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
      const a = tool.execute(unseeded, { random: () => 0.25 });
      if (!a.ok) throw new Error("Expected a feasible context-driven fixture");
      expect(matchesToolJsonSchema(a.output, tool.outputSchema)).toBe(true);
      expect(tool.execute(unseeded, { random: () => 0.25 })).toEqual(a);
    });
    it("reports malformed data and invalid advancing sources", () => {
      expect(tool.execute(null)).toMatchObject({
        ok: false,
        error: { issues: [{ code: "object_required" }] },
      });
      const missing = tool.execute({});
      expect(missing).toMatchObject({
        ok: false,
        error: { code: "invalid_input" },
      });
      if (missing.ok)
        throw new Error("Expected all required fields to be reported");
      const requiredFields = tool.inputSchema.required ?? [];
      expect(missing.error.issues).toHaveLength(requiredFields.length);
      expect(
        missing.error.issues.map(({ field, code }) => ({ field, code })),
      ).toEqual(
        expect.arrayContaining(
          requiredFields.map((field) => ({ field, code: "required_field" })),
        ),
      );
      expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "unknown_field", field: "extra" }] },
      });
      expect(tool.execute({ ...example.input, seed: Infinity })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "seed" }] },
      });
      const { seed, ...input } = example.input;
      for (const draw of [-1, 1, NaN, Infinity])
        expect(tool.execute(input, { random: () => draw })).toMatchObject({
          ok: false,
          error: {
            issues: [{ code: "invalid_random_source", field: "random" }],
          },
        });
      expect(
        tool.execute(input, {
          random: () => {
            throw new Error("source failure");
          },
        }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    });
    it("rejects sparse collections and accessor-backed fields without evaluating them", () => {
      const collection = Object.entries(example.input).find(([, value]) =>
        Array.isArray(value),
      );
      if (!collection)
        throw new Error("Every generator fixture has a collection");
      const sparse: unknown[] = Array(2);
      expect(
        tool.execute({ ...example.input, [collection[0]]: sparse }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: collection[0] }] },
      });
      let evaluated = false;
      const accessor = { ...example.input };
      Object.defineProperty(accessor, collection[0], {
        enumerable: true,
        get: () => {
          evaluated = true;
          return collection[1];
        },
      });
      expect(tool.execute(accessor)).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: collection[0] }] },
      });
      expect(evaluated).toBe(false);
    });
  });
};
