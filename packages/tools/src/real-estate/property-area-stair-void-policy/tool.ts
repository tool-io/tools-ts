import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly stairVoid: number;
  readonly commonArea: number;
  readonly countStairVoid: boolean;
};
export type Output = { readonly reportedArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    stairVoid: { type: "number", minimum: 0 },
    commonArea: { type: "number", minimum: 0 },
    countStairVoid: { type: "boolean" },
  },
  required: ["grossArea", "stairVoid", "commonArea", "countStairVoid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reportedArea: { type: "number" } },
  required: ["reportedArea"],
} as const;
/** Use explicit area-inclusion assumptions rather than selecting a property measurement standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, stairVoid, commonArea, countStairVoid } = request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        stairVoid >= 0 &&
        commonArea >= 0 &&
        stairVoid + commonArea <= grossArea,
    );
    return {
      reportedArea: grossArea - commonArea - (countStairVoid ? 0 : stairVoid),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossArea: 100,
    stairVoid: 10,
    commonArea: 5,
    countStairVoid: false,
  },
  output: { reportedArea: 85 },
} satisfies ToolExample<Input, Output>;
export const propertyAreaStairVoidPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/property-area-stair-void-policy",
    title: "Property Area Stair Void Policy Tool",
    description:
      "Use explicit area-inclusion assumptions rather than selecting a property measurement standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        stairVoid: { type: "number", minimum: 0 },
        commonArea: { type: "number", minimum: 0 },
        countStairVoid: { type: "boolean" },
      },
      required: ["grossArea", "stairVoid", "commonArea", "countStairVoid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reportedArea: { type: "number" } },
      required: ["reportedArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stairVoid",
          label: "Stair Void",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commonArea",
          label: "Common Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countStairVoid",
          label: "Count Stair Void",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedArea",
          label: "Reported Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propertyAreaStairVoidPolicyTool.execute;
export default propertyAreaStairVoidPolicyTool;
