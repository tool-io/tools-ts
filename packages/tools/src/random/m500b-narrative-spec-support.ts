import { expect, it } from "vitest";
import type { ToolDefinition } from "../core/definition.js";
import type { ToolExample } from "../core/example.js";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../core/contract.js";
import type { NSeed } from "./m500b-narrative-support.js";

/** Registers tests only when invoked by an owned colocated spec. */
export const narrativeContract = <Input extends NSeed, Output>(
  tool: ToolDefinition<Input, Output>,
  example: ToolExample<Input, Output>,
  calculate: ToolDefinition<Input, Output>["execute"],
  index: ToolDefinition<Input, Output>,
): void => {
  it("lightweight canonical direct/index/default contract and JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    const expected = { ok: true, output: example.output };
    expect(calculate(example.input)).toEqual(expected);
    expect(tool.execute(example.input)).toEqual(expected);
    expect(index.execute(example.input)).toEqual(expected);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight full missing fields and exact unknown/seed diagnostics", () => {
    const result = calculate({});
    if (result.ok) throw new Error("Expected missing fields");
    const fields = tool.inputSchema.required ?? [];
    expect(result.error.issues.map((issue) => issue.field)).toEqual(fields);
    expect(result.error.issues).toHaveLength(fields.length);
    expect(
      result.error.issues.every((issue) => issue.code === "required_field"),
    ).toBe(true);
    expect(calculate({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(calculate({ ...example.input, seed: Infinity })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(calculate(null)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "", code: "object_required" }] },
    });
  });
  it("lightweight immutable replay and explicit seed precedence", () => {
    const copy = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(calculate(copy)).toEqual({ ok: true, output: example.output });
    expect(copy).toEqual(example.input);
    expect(
      calculate(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed: _seed, ...unseeded } = example.input;
    expect(calculate(unseeded)).toEqual(calculate(unseeded));
  });
  it("lightweight checked context source failures and advancing draws", () => {
    const { seed: _seed, ...unseeded } = example.input;
    for (const value of [1, NaN])
      expect(calculate(unseeded, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      calculate(unseeded, {
        random: () => {
          throw new Error("source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    let draws = 0;
    const result = calculate(unseeded, {
      random: () => {
        draws += 1;
        return draws === 1 ? 0 : 1;
      },
    });
    if (result.ok) expect(draws).toBe(1);
    else {
      expect(result).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
      expect(draws).toBe(2);
    }
  });
};
