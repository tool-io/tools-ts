import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "./core/contract.js";
import backward from "./list/backward-fill-source-indexes/tool.js";
import forward from "./list/forward-fill-source-indexes/tool.js";
import nearest from "./list/nearest-nonmissing-index-map/tool.js";
import next from "./bits/bitstring-next-set-position/tool.js";
import selectOne from "./bits/bitstring-select-one-query/tool.js";
import selectZero from "./bits/bitstring-select-zero-query/tool.js";
import argument from "./arguments/long-option-assignment-split/tool.js";

describe("nullable lookup result contracts", () => {
  it.each([
    {
      tool: backward,
      input: { present: [0, 0] },
      expected: { sourceIndexes: [null, null] },
    },
    {
      tool: forward,
      input: { present: [0, 0] },
      expected: { sourceIndexes: [null, null] },
    },
    {
      tool: nearest,
      input: { present: [0, 0] },
      expected: { sourceIndexes: [null, null] },
    },
    {
      tool: next,
      input: { bits: "000", position: 0 },
      expected: { position: null },
    },
    {
      tool: next,
      input: { bits: "1", position: 1 },
      expected: { position: null },
    },
    {
      tool: selectOne,
      input: { bits: "000", occurrence: 0 },
      expected: { position: null },
    },
    {
      tool: selectZero,
      input: { bits: "111", occurrence: 0 },
      expected: { position: null },
    },
    {
      tool: argument,
      input: { argument: "--name" },
      expected: { name: "name", assigned: false, value: null },
    },
  ])(
    "preserves explicit absence through $tool.id",
    ({ tool, input, expected }) => {
      expect(validateToolContract(tool)).toEqual([]);
      expect(
        matchesToolJsonSchema({ result: expected }, tool.outputSchema),
      ).toBe(true);
      expect(tool.execute(input)).toEqual({
        ok: true,
        output: { result: expected },
      });
    },
  );
  it("does not widen nullable fields to arbitrary values", () => {
    expect(
      matchesToolJsonSchema(
        { result: { position: "missing" } },
        next.outputSchema,
      ),
    ).toBe(false);
    expect(
      matchesToolJsonSchema(
        { result: { sourceIndexes: ["missing"] } },
        backward.outputSchema,
      ),
    ).toBe(false);
    expect(
      matchesToolJsonSchema(
        { result: { name: "name", assigned: false, value: 42 } },
        argument.outputSchema,
      ),
    ).toBe(false);
  });
});
