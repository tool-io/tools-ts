import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assertionIds: readonly string[];
  readonly pathIds: readonly string[];
  readonly valid: readonly boolean[];
  readonly selectedAssertion: string;
};
export type Output = {
  readonly distinctPaths: number;
  readonly validPaths: number;
  readonly invalidOnlyPaths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assertionIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pathIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedAssertion: { type: "string", maxLength: 8192 },
  },
  required: ["assertionIds", "pathIds", "valid", "selectedAssertion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctPaths: { type: "integer" },
    validPaths: { type: "integer" },
    invalidOnlyPaths: { type: "integer" },
  },
  required: ["distinctPaths", "validPaths", "invalidOnlyPaths"],
} as const;
/** Count supplied support-path records, without assessing truth or logical validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assertionIds, pathIds, valid, selectedAssertion } = request;
  const compute = (): Output => {
    H.sameLength(assertionIds, pathIds);
    H.sameLength(assertionIds, valid);
    return (() => {
      const all = new Set(
          pathIds.filter((x, i) => assertionIds[i] === selectedAssertion),
        ),
        yes = new Set(
          pathIds.filter(
            (x, i) => assertionIds[i] === selectedAssertion && valid[i],
          ),
        );
      return {
        distinctPaths: all.size,
        validPaths: yes.size,
        invalidOnlyPaths: all.size - yes.size,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assertionIds: ["a", "a", "a"],
    pathIds: ["x", "x", "y"],
    valid: [true, false, false],
    selectedAssertion: "a",
  },
  output: { distinctPaths: 2, validPaths: 1, invalidOnlyPaths: 1 },
} satisfies ToolExample<Input, Output>;
export const assertionSupportPathCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/assertion-support-path-count",
    title: "Assertion Support Path Count Tool",
    description:
      "Count supplied support-path records, without assessing truth or logical validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assertionIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        pathIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedAssertion: { type: "string", maxLength: 8192 },
      },
      required: ["assertionIds", "pathIds", "valid", "selectedAssertion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctPaths: { type: "integer" },
        validPaths: { type: "integer" },
        invalidOnlyPaths: { type: "integer" },
      },
      required: ["distinctPaths", "validPaths", "invalidOnlyPaths"],
    },
    ports: {
      inputs: [
        {
          id: "assertionIds",
          label: "Assertion Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "pathIds",
          label: "Path Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedAssertion",
          label: "Selected Assertion",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "distinctPaths",
          label: "Distinct Paths",
          valueType: { type: "integer" },
        },
        {
          id: "validPaths",
          label: "Valid Paths",
          valueType: { type: "integer" },
        },
        {
          id: "invalidOnlyPaths",
          label: "Invalid Only Paths",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = assertionSupportPathCountTool.execute;
export default assertionSupportPathCountTool;
