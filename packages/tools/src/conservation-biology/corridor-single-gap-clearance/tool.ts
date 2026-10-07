import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredGapWidth: number;
  readonly maximumPermittedGap: number;
};
export type Output = {
  readonly margin: number;
  readonly withinSuppliedGap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredGapWidth: { type: "number", minimum: 0 },
    maximumPermittedGap: { type: "number", minimum: 0 },
  },
  required: ["measuredGapWidth", "maximumPermittedGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    withinSuppliedGap: { type: "boolean" },
  },
  required: ["margin", "withinSuppliedGap"],
} as const;
/** Compare a measured corridor gap with an explicitly supplied inclusive maximum without choosing a species-specific connectivity threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredGapWidth, maximumPermittedGap } = request;
  const compute = (): Output => {
    H.domain(
      measuredGapWidth >= 0 && maximumPermittedGap >= 0,
      "measuredGapWidth",
    );
    return {
      margin: maximumPermittedGap - measuredGapWidth,
      withinSuppliedGap: measuredGapWidth <= maximumPermittedGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredGapWidth: 20, maximumPermittedGap: 30 },
  output: { margin: 10, withinSuppliedGap: true },
} satisfies ToolExample<Input, Output>;
export const corridorSingleGapClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/corridor-single-gap-clearance",
    title: "Corridor Single Gap Clearance",
    description:
      "Compare a measured corridor gap with an explicitly supplied inclusive maximum without choosing a species-specific connectivity threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGapWidth: { type: "number", minimum: 0 },
        maximumPermittedGap: { type: "number", minimum: 0 },
      },
      required: ["measuredGapWidth", "maximumPermittedGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        withinSuppliedGap: { type: "boolean" },
      },
      required: ["margin", "withinSuppliedGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredGapWidth",
          label: "Measured Gap Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumPermittedGap",
          label: "Maximum Permitted Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinSuppliedGap",
          label: "Within Supplied Gap",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = corridorSingleGapClearanceTool.execute;
export default corridorSingleGapClearanceTool;
