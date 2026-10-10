import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedTravelLimit: number;
  readonly observedTravelTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedTravelLimit: { type: "number" },
    observedTravelTime: { type: "number" },
  },
  required: ["suppliedTravelLimit", "observedTravelTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied observed-minus-catchment-limit travel time without routing or inferring service eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedTravelLimit, observedTravelTime } = request;
  const compute = (): Output => {
    return { signedGap: observedTravelTime - suppliedTravelLimit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedTravelLimit: 12, observedTravelTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const serviceCatchmentEdgeTravelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/service-catchment-edge-travel-gap",
    title: "Service Catchment Edge Travel Gap Tool",
    description:
      "Calculate supplied observed-minus-catchment-limit travel time without routing or inferring service eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedTravelLimit: { type: "number" },
        observedTravelTime: { type: "number" },
      },
      required: ["suppliedTravelLimit", "observedTravelTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedTravelLimit",
          label: "Supplied Travel Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedTravelTime",
          label: "Observed Travel Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceCatchmentEdgeTravelGapTool.execute;
export default serviceCatchmentEdgeTravelGapTool;
