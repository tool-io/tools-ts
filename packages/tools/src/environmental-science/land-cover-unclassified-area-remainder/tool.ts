import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly classifiedAreas: readonly number[];
};
export type Output = {
  readonly classifiedArea: number;
  readonly unclassifiedResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", minimum: 0 },
    classifiedAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["totalArea", "classifiedAreas"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classifiedArea: { type: "number" },
    unclassifiedResidual: { type: "number" },
  },
  required: ["classifiedArea", "unclassifiedResidual"],
} as const;
/** Subtract explicit nonoverlapping classified areas from total area, preserving over-allocation as a negative residual. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, classifiedAreas } = request;
  const compute = (): Output => {
    H.domain(totalArea >= 0, "totalArea");
    return (() => {
      H.domain(
        classifiedAreas.every((value) => value >= 0),
        "classifiedAreas",
      );
      const classifiedArea = classifiedAreas.reduce((a, b) => a + b, 0);
      return {
        classifiedArea,
        unclassifiedResidual: totalArea - classifiedArea,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, classifiedAreas: [30, 45] },
  output: { classifiedArea: 75, unclassifiedResidual: 25 },
} satisfies ToolExample<Input, Output>;
export const landCoverUnclassifiedAreaRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-science",
        "environmental science",
        "earth and environmental sciences",
      ],
      keywords: ["environmental science", "earth and environmental sciences"],
    },
    id: "environmental-science/land-cover-unclassified-area-remainder",
    title: "Land Cover Unclassified Area Remainder",
    description:
      "Subtract explicit nonoverlapping classified areas from total area, preserving over-allocation as a negative residual.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", minimum: 0 },
        classifiedAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["totalArea", "classifiedAreas"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classifiedArea: { type: "number" },
        unclassifiedResidual: { type: "number" },
      },
      required: ["classifiedArea", "unclassifiedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "classifiedAreas",
          label: "Classified Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "classifiedArea",
          label: "Classified Area",
          valueType: { type: "number" },
        },
        {
          id: "unclassifiedResidual",
          label: "Unclassified Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landCoverUnclassifiedAreaRemainderTool.execute;
export default landCoverUnclassifiedAreaRemainderTool;
