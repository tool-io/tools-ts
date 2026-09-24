import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly direction: string;
  readonly inclusive: boolean;
};
export type Output = {
  readonly lowerPresent: boolean;
  readonly upperPresent: boolean;
  readonly bound: number;
  readonly inclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number" },
    direction: { type: "string", maxLength: 8192, enum: ["left", "right"] },
    inclusive: { type: "boolean" },
  },
  required: ["limit", "direction", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPresent: { type: "boolean" },
    upperPresent: { type: "boolean" },
    bound: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
} as const;
/** Represent a supplied one-sided censor limit without imputation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, direction, inclusive } = request;
  const compute = (): Output => {
    H.domain(["left", "right"].includes(direction), "direction");
    return {
      lowerPresent: direction === "right",
      upperPresent: direction === "left",
      bound: limit,
      inclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 5, direction: "left", inclusive: false },
  output: {
    lowerPresent: false,
    upperPresent: true,
    bound: 5,
    inclusive: false,
  },
} satisfies ToolExample<Input, Output>;
export const studyDataCensorLimitDirectionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/study-data-censor-limit-direction-token",
    title: "Study Data Censor Limit Direction Token Tool",
    description:
      "Represent a supplied one-sided censor limit without imputation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number" },
        direction: { type: "string", maxLength: 8192, enum: ["left", "right"] },
        inclusive: { type: "boolean" },
      },
      required: ["limit", "direction", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerPresent: { type: "boolean" },
        upperPresent: { type: "boolean" },
        bound: { type: "number" },
        inclusive: { type: "boolean" },
      },
      required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
    },
    ports: {
      inputs: [
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerPresent",
          label: "Lower Present",
          valueType: { type: "boolean" },
        },
        {
          id: "upperPresent",
          label: "Upper Present",
          valueType: { type: "boolean" },
        },
        { id: "bound", label: "Bound", valueType: { type: "number" } },
        { id: "inclusive", label: "Inclusive", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studyDataCensorLimitDirectionTokenTool.execute;
export default studyDataCensorLimitDirectionTokenTool;
