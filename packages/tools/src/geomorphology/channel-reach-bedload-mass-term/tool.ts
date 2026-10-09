import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massFluxPerWidthTime: number;
  readonly activeWidth: number;
  readonly duration: number;
};
export type Output = { readonly transportedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massFluxPerWidthTime: { type: "number", minimum: 0 },
    activeWidth: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["massFluxPerWidthTime", "activeWidth", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transportedMass: { type: "number" } },
  required: ["transportedMass"],
} as const;
/** Integrate a supplied uniform bedload mass flux per unit width and time over explicit active width and duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massFluxPerWidthTime, activeWidth, duration } = request;
  const compute = (): Output => {
    H.domain(massFluxPerWidthTime >= 0, "massFluxPerWidthTime");
    H.domain(activeWidth >= 0, "activeWidth");
    H.domain(duration >= 0, "duration");
    return { transportedMass: massFluxPerWidthTime * activeWidth * duration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massFluxPerWidthTime: 2, activeWidth: 5, duration: 3 },
  output: { transportedMass: 30 },
} satisfies ToolExample<Input, Output>;
export const channelReachBedloadMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/channel-reach-bedload-mass-term",
    title: "Channel Reach Bedload Mass Term Tool",
    description:
      "Integrate a supplied uniform bedload mass flux per unit width and time over explicit active width and duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massFluxPerWidthTime: { type: "number", minimum: 0 },
        activeWidth: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["massFluxPerWidthTime", "activeWidth", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transportedMass: { type: "number" } },
      required: ["transportedMass"],
    },
    ports: {
      inputs: [
        {
          id: "massFluxPerWidthTime",
          label: "Mass Flux Per Width Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeWidth",
          label: "Active Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transportedMass",
          label: "Transported Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelReachBedloadMassTermTool.execute;
export default channelReachBedloadMassTermTool;
