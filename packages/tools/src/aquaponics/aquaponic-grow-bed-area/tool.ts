import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalLength: number;
  readonly internalWidth: number;
  readonly bedCount: number;
};
export type Output = { readonly totalPlanArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalLength: { type: "number", minimum: 0 },
    internalWidth: { type: "number", minimum: 0 },
    bedCount: { type: "integer", minimum: 0 },
  },
  required: ["internalLength", "internalWidth", "bedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalPlanArea: { type: "number" } },
  required: ["totalPlanArea"],
} as const;
/** Calculate explicit rectangular grow-bed plan area times supplied identical bed count without recommending system sizing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalLength, internalWidth, bedCount } = request;
  const compute = (): Output => {
    H.domain(internalLength >= 0 && internalWidth >= 0, "internalLength");
    (H.domain(
      Number.isSafeInteger(bedCount) &&
        bedCount >= 0 &&
        bedCount <= Number.MAX_SAFE_INTEGER,
      "bedCount",
    ),
      bedCount);
    return { totalPlanArea: internalLength * internalWidth * bedCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { internalLength: 2, internalWidth: 1, bedCount: 3 },
  output: { totalPlanArea: 6 },
} satisfies ToolExample<Input, Output>;
export const aquaponicGrowBedAreaTool = H.defineSchemaCalculation<
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
    id: "aquaponics/aquaponic-grow-bed-area",
    title: "Aquaponic Grow BED Area",
    description:
      "Calculate explicit rectangular grow-bed plan area times supplied identical bed count without recommending system sizing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalLength: { type: "number", minimum: 0 },
        internalWidth: { type: "number", minimum: 0 },
        bedCount: { type: "integer", minimum: 0 },
      },
      required: ["internalLength", "internalWidth", "bedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalPlanArea: { type: "number" } },
      required: ["totalPlanArea"],
    },
    ports: {
      inputs: [
        {
          id: "internalLength",
          label: "Internal Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "internalWidth",
          label: "Internal Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedCount",
          label: "Bed Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalPlanArea",
          label: "Total Plan Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicGrowBedAreaTool.execute;
export default aquaponicGrowBedAreaTool;
