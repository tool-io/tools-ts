import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotArea: number;
  readonly commonPathArea: number;
  readonly participantCount: number;
  readonly privateArea: number;
};
export type Output = {
  readonly allocatedCommonArea: number;
  readonly totalAllocatedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotArea: { type: "number", minimum: 0 },
    commonPathArea: { type: "number", minimum: 0 },
    participantCount: { type: "integer", minimum: 1 },
    privateArea: { type: "number", minimum: 0 },
  },
  required: ["plotArea", "commonPathArea", "participantCount", "privateArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedCommonArea: { type: "number" },
    totalAllocatedArea: { type: "number" },
  },
  required: ["allocatedCommonArea", "totalAllocatedArea"],
} as const;
/** Calculate community plot common path share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotArea, commonPathArea, participantCount, privateArea } = request;
  const compute = (): Output => {
    H.integer(participantCount, 1);
    H.domain(
      plotArea >= 0 &&
        commonPathArea >= 0 &&
        commonPathArea <= plotArea &&
        privateArea >= 0 &&
        participantCount * privateArea + commonPathArea <= plotArea,
    );
    return {
      allocatedCommonArea: commonPathArea / participantCount,
      totalAllocatedArea: privateArea + commonPathArea / participantCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plotArea: 100,
    commonPathArea: 20,
    participantCount: 4,
    privateArea: 15,
  },
  output: { allocatedCommonArea: 5, totalAllocatedArea: 20 },
} satisfies ToolExample<Input, Output>;
export const communityPlotCommonPathShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/community-plot-common-path-share",
    title: "Community Plot Common Path Share Tool",
    description:
      "Calculate community plot common path share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotArea: { type: "number", minimum: 0 },
        commonPathArea: { type: "number", minimum: 0 },
        participantCount: { type: "integer", minimum: 1 },
        privateArea: { type: "number", minimum: 0 },
      },
      required: [
        "plotArea",
        "commonPathArea",
        "participantCount",
        "privateArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedCommonArea: { type: "number" },
        totalAllocatedArea: { type: "number" },
      },
      required: ["allocatedCommonArea", "totalAllocatedArea"],
    },
    ports: {
      inputs: [
        {
          id: "plotArea",
          label: "Plot Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commonPathArea",
          label: "Common Path Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participantCount",
          label: "Participant Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "privateArea",
          label: "Private Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedCommonArea",
          label: "Allocated Common Area",
          valueType: { type: "number" },
        },
        {
          id: "totalAllocatedArea",
          label: "Total Allocated Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityPlotCommonPathShareTool.execute;
export default communityPlotCommonPathShareTool;
