import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredClearDiameter: number;
  readonly suppliedRequiredDiameter: number;
};
export type Output = {
  readonly turningMargin: number;
  readonly meetsSuppliedDiameter: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredClearDiameter: { type: "number", minimum: 0 },
    suppliedRequiredDiameter: { type: "number", minimum: 0 },
  },
  required: ["measuredClearDiameter", "suppliedRequiredDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turningMargin: { type: "number" },
    meetsSuppliedDiameter: { type: "boolean" },
  },
  required: ["turningMargin", "meetsSuppliedDiameter"],
} as const;
/** Compare an explicit turning diameter with a supplied requirement without certifying an accessible route or selecting standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredClearDiameter, suppliedRequiredDiameter } = request;
  const compute = (): Output => {
    H.domain(
      measuredClearDiameter >= 0 && suppliedRequiredDiameter >= 0,
      "measuredClearDiameter",
    );
    return {
      turningMargin: measuredClearDiameter - suppliedRequiredDiameter,
      meetsSuppliedDiameter: measuredClearDiameter >= suppliedRequiredDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredClearDiameter: 160, suppliedRequiredDiameter: 150 },
  output: { turningMargin: 10, meetsSuppliedDiameter: true },
} satisfies ToolExample<Input, Output>;
export const accessRouteMeasuredTurningMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/access-route-measured-turning-margin",
    title: "Access Route Measured Turning Margin",
    description:
      "Compare an explicit turning diameter with a supplied requirement without certifying an accessible route or selecting standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredClearDiameter: { type: "number", minimum: 0 },
        suppliedRequiredDiameter: { type: "number", minimum: 0 },
      },
      required: ["measuredClearDiameter", "suppliedRequiredDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turningMargin: { type: "number" },
        meetsSuppliedDiameter: { type: "boolean" },
      },
      required: ["turningMargin", "meetsSuppliedDiameter"],
    },
    ports: {
      inputs: [
        {
          id: "measuredClearDiameter",
          label: "Measured Clear Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredDiameter",
          label: "Supplied Required Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "turningMargin",
          label: "Turning Margin",
          valueType: { type: "number" },
        },
        {
          id: "meetsSuppliedDiameter",
          label: "Meets Supplied Diameter",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessRouteMeasuredTurningMarginTool.execute;
export default accessRouteMeasuredTurningMarginTool;
