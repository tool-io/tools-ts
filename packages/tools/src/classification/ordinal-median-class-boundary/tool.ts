import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedClasses: readonly string[];
  readonly probabilities: readonly number[];
  readonly equalityToLower: boolean;
};
export type Output = {
  readonly classIndex: number;
  readonly classLabel: string;
  readonly cumulativeMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedClasses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    probabilities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    equalityToLower: { type: "boolean" },
  },
  required: ["orderedClasses", "probabilities", "equalityToLower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classIndex: { type: "integer" },
    classLabel: { type: "string", maxLength: 8192 },
    cumulativeMass: { type: "number" },
  },
  required: ["classIndex", "classLabel", "cumulativeMass"],
} as const;
/** Select a supplied ordinal mass median with an explicit exact-half boundary convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedClasses, probabilities, equalityToLower } = request;
  const compute = (): Output => {
    H.sameLength(orderedClasses, probabilities);
    H.domain(
      orderedClasses.length > 0 &&
        new Set(orderedClasses).size === orderedClasses.length &&
        probabilities.every((x) => x >= 0),
    );
    const total = probabilities.reduce((a, b) => a + b, 0);
    H.positive(total);
    let cumulativeMass = 0,
      index = probabilities.length - 1;
    for (let i = 0; i < probabilities.length; i++) {
      cumulativeMass += probabilities[i];
      if (
        equalityToLower
          ? cumulativeMass >= total / 2
          : cumulativeMass > total / 2
      ) {
        index = i;
        break;
      }
    }
    return {
      classIndex: index,
      classLabel: orderedClasses[index],
      cumulativeMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    orderedClasses: ["A", "B", "C"],
    probabilities: [0.5, 0.25, 0.25],
    equalityToLower: true,
  },
  output: { classIndex: 0, classLabel: "A", cumulativeMass: 0.5 },
} satisfies ToolExample<Input, Output>;
export const ordinalMedianClassBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/ordinal-median-class-boundary",
    title: "Ordinal Median Class Boundary Tool",
    description:
      "Select a supplied ordinal mass median with an explicit exact-half boundary convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedClasses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        equalityToLower: { type: "boolean" },
      },
      required: ["orderedClasses", "probabilities", "equalityToLower"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classIndex: { type: "integer" },
        classLabel: { type: "string", maxLength: 8192 },
        cumulativeMass: { type: "number" },
      },
      required: ["classIndex", "classLabel", "cumulativeMass"],
    },
    ports: {
      inputs: [
        {
          id: "orderedClasses",
          label: "Ordered Classes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "equalityToLower",
          label: "Equality To Lower",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "classIndex",
          label: "Class Index",
          valueType: { type: "integer" },
        },
        {
          id: "classLabel",
          label: "Class Label",
          valueType: { type: "string" },
        },
        {
          id: "cumulativeMass",
          label: "Cumulative Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ordinalMedianClassBoundaryTool.execute;
export default ordinalMedianClassBoundaryTool;
