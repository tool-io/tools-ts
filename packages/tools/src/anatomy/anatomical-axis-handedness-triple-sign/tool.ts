import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly third: readonly number[];
};
export type Output = {
  readonly tripleProduct: number;
  readonly handedness: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    third: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tripleProduct: { type: "number" },
    handedness: { type: "string", maxLength: 8192 },
  },
  required: ["tripleProduct", "handedness"],
} as const;
/** Calculate anatomical axis handedness triple sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, third } = request;
  const compute = (): Output => {
    H.domain(first.length === 3 && second.length === 3 && third.length === 3);
    return {
      tripleProduct:
        first[0] * (second[1] * third[2] - second[2] * third[1]) -
        first[1] * (second[0] * third[2] - second[2] * third[0]) +
        first[2] * (second[0] * third[1] - second[1] * third[0]),
      handedness:
        H.dot(first, [
          second[1] * third[2] - second[2] * third[1],
          second[2] * third[0] - second[0] * third[2],
          second[0] * third[1] - second[1] * third[0],
        ]) > 0
          ? "right-handed"
          : H.dot(first, [
                second[1] * third[2] - second[2] * third[1],
                second[2] * third[0] - second[0] * third[2],
                second[0] * third[1] - second[1] * third[0],
              ]) < 0
            ? "left-handed"
            : "degenerate",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, 0, 0], second: [0, 1, 0], third: [0, 0, 1] },
  output: { tripleProduct: 1, handedness: "right-handed" },
} satisfies ToolExample<Input, Output>;
export const anatomicalAxisHandednessTripleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/anatomical-axis-handedness-triple-sign",
    title: "Anatomical Axis Handedness Triple Sign Tool",
    description:
      "Calculate anatomical axis handedness triple sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        third: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tripleProduct: { type: "number" },
        handedness: { type: "string", maxLength: 8192 },
      },
      required: ["tripleProduct", "handedness"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "tripleProduct",
          label: "Triple Product",
          valueType: { type: "number" },
        },
        {
          id: "handedness",
          label: "Handedness",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomicalAxisHandednessTripleSignTool.execute;
export default anatomicalAxisHandednessTripleSignTool;
