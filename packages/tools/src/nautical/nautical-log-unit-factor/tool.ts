import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loggedDistance: number;
  readonly metersPerLogUnit: number;
  readonly targetMetersPerUnit: number;
};
export type Output = { readonly convertedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loggedDistance: { type: "number", minimum: 0 },
    metersPerLogUnit: { type: "number", exclusiveMinimum: 0 },
    targetMetersPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["loggedDistance", "metersPerLogUnit", "targetMetersPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedDistance: { type: "number" } },
  required: ["convertedDistance"],
} as const;
/** Convert a logged distance with explicit compatible distance-unit factors, without navigation inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loggedDistance, metersPerLogUnit, targetMetersPerUnit } = request;
  const compute = (): Output => {
    H.domain(loggedDistance >= 0);
    H.positive(metersPerLogUnit);
    H.positive(targetMetersPerUnit);
    return {
      convertedDistance:
        (loggedDistance * metersPerLogUnit) / targetMetersPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loggedDistance: 2,
    metersPerLogUnit: 1852,
    targetMetersPerUnit: 1000,
  },
  output: { convertedDistance: 3.704 },
} satisfies ToolExample<Input, Output>;
export const nauticalLogUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-log-unit-factor",
    title: "Nautical Log Unit Factor Tool",
    description:
      "Convert a logged distance with explicit compatible distance-unit factors, without navigation inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loggedDistance: { type: "number", minimum: 0 },
        metersPerLogUnit: { type: "number", exclusiveMinimum: 0 },
        targetMetersPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["loggedDistance", "metersPerLogUnit", "targetMetersPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedDistance: { type: "number" } },
      required: ["convertedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "loggedDistance",
          label: "Logged Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "metersPerLogUnit",
          label: "Meters Per Log Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetMetersPerUnit",
          label: "Target Meters Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedDistance",
          label: "Converted Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nauticalLogUnitFactorTool.execute;
export default nauticalLogUnitFactorTool;
