import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly tankFlow: number; readonly bedFlow: number };
export type Output = { readonly tankToBedRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tankFlow: { type: "number", minimum: 0 },
    bedFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["tankFlow", "bedFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tankToBedRatio: { type: "number" } },
  required: ["tankToBedRatio"],
} as const;
/** Compare explicit tank and bed flow rates on the same volume-time basis without selecting a circulation ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tankFlow, bedFlow } = request;
  const compute = (): Output => {
    H.domain(tankFlow >= 0, "tankFlow");
    (H.domain(bedFlow > 0, "bedFlow"), bedFlow);
    return { tankToBedRatio: tankFlow / bedFlow };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tankFlow: 120, bedFlow: 80 },
  output: { tankToBedRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const aquaponicTankBedFlowRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-tank-bed-flow-ratio",
    title: "Aquaponic Tank BED Flow Ratio",
    description:
      "Compare explicit tank and bed flow rates on the same volume-time basis without selecting a circulation ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tankFlow: { type: "number", minimum: 0 },
        bedFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["tankFlow", "bedFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tankToBedRatio: { type: "number" } },
      required: ["tankToBedRatio"],
    },
    ports: {
      inputs: [
        {
          id: "tankFlow",
          label: "Tank Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedFlow",
          label: "Bed Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "tankToBedRatio",
          label: "Tank To Bed Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicTankBedFlowRatioTool.execute;
export default aquaponicTankBedFlowRatioTool;
