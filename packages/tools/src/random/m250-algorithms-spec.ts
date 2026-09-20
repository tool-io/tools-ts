import { describe, expect, it } from "vitest";
import type {
  ToolDefinition,
  ToolExecutionContext,
} from "../core/definition.js";
import { validateToolContract } from "../core/contract.js";
import { matchesModelInput } from "../core/model-definition.js";
import type { ToolResult } from "../core/result.js";

const freezeData = (value: unknown): void => {
  if (typeof value !== "object" || value === null) return;
  for (const child of Object.values(value)) freezeData(child);
  Object.freeze(value);
};
/** Registers contract/replay tests only; no calculation runs at module initialization. */
export const authoredGeneratorTests = <I extends { readonly seed?: number }, O>(
  tool: ToolDefinition<I, O>,
  calculate: (input: unknown, context?: ToolExecutionContext) => ToolResult<O>,
  example: { readonly input: I; readonly output: O },
): void => {
  describe(tool.id, () => {
    it("publishes matching contracts and literal direct/runner examples", () => {
      expect(validateToolContract(tool)).toEqual([]);
      expect(matchesModelInput(example.input, tool.inputSchema)).toBe(true);
      expect(matchesModelInput(example.output, tool.outputSchema)).toBe(true);
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
    it("replays default/explicit seeds and ignores context when seed is supplied", () => {
      const { seed: omitted, ...unseeded } = example.input;
      expect(omitted).toBeDefined();
      const first = tool.execute(unseeded),
        second = tool.execute(unseeded);
      expect(first.ok).toBe(true);
      expect(second).toEqual(first);
      if (first.ok)
        expect(matchesModelInput(first.output, tool.outputSchema)).toBe(true);
      expect(
        tool.execute(example.input, {
          random: () => {
            throw new Error("must not be called");
          },
        }),
      ).toEqual({ ok: true, output: example.output });
      const contextResult = tool.execute(unseeded, { random: () => 0.5 });
      expect(contextResult.ok).toBe(true);
      if (contextResult.ok) {
        expect(contextResult.output).toMatchObject({
          randomness: { source: "context", seed: null },
        });
        expect(matchesModelInput(contextResult.output, tool.outputSchema)).toBe(
          true,
        );
      }
    });
    it("reports invalid injected sources and malformed JSON data with issue codes", () => {
      const { seed: omitted, ...unseeded } = example.input;
      expect(omitted).toBeDefined();
      for (const random of [
        () => -0.1,
        () => 1,
        () => NaN,
        () => Infinity,
        () => {
          throw new Error("source failure");
        },
      ])
        expect(tool.execute(unseeded, { random })).toMatchObject({
          ok: false,
          error: {
            issues: [{ field: "random", code: "invalid_random_source" }],
          },
        });
      expect(tool.execute({ ...example.input, seed: 0.1 })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "seed", code: "invalid_field" }] },
      });
      expect(
        tool.execute({ ...example.input, unknownField: true }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ field: "unknownField", code: "unknown_field" }] },
      });
      expect(tool.execute(null)).toMatchObject({
        ok: false,
        error: { issues: [{ code: "object_required" }] },
      });
      const firstRequired = tool.inputSchema.required?.[0];
      if (!firstRequired) throw new Error("expected a concrete required input");
      const missing = Object.fromEntries(
        Object.entries(example.input).filter(
          ([field]) => field !== firstRequired,
        ),
      );
      expect(tool.execute(missing)).toMatchObject({
        ok: false,
        error: { issues: [{ field: firstRequired, code: "required_field" }] },
      });
      const accessor = Object.defineProperty({ ...example.input }, "seed", {
        get: () => {
          throw new Error("accessor must not run");
        },
        enumerable: true,
      });
      expect(tool.execute(accessor)).toMatchObject({
        ok: false,
        error: { issues: [{ field: "seed", code: "invalid_field" }] },
      });
    });
    it("does not mutate frozen caller data", () => {
      const before = JSON.stringify(example.input);
      freezeData(example.input);
      expect(calculate(example.input)).toEqual({
        ok: true,
        output: example.output,
      });
      expect(JSON.stringify(example.input)).toBe(before);
    });
  });
};
