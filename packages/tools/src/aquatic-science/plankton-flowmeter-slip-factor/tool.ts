import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly revolutions: number;
  readonly distancePerRevolution: number;
  readonly suppliedSlip: number;
  readonly mouthArea: number;
};
export type Output = {
  readonly distance: number;
  readonly filteredVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revolutions: { type: "number", minimum: 0 },
    distancePerRevolution: { type: "number", minimum: 0 },
    suppliedSlip: { type: "number", minimum: 0, maximum: 1 },
    mouthArea: { type: "number", minimum: 0 },
  },
  required: [
    "revolutions",
    "distancePerRevolution",
    "suppliedSlip",
    "mouthArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    filteredVolume: { type: "number" },
  },
  required: ["distance", "filteredVolume"],
} as const;
/** Calculate plankton flowmeter slip factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { revolutions, distancePerRevolution, suppliedSlip, mouthArea } =
    request;
  const compute = (): Output => {
    H.domain(revolutions >= 0 && distancePerRevolution >= 0 && mouthArea >= 0);
    H.probability(suppliedSlip);
    return {
      distance: revolutions * distancePerRevolution * (1 - suppliedSlip),
      filteredVolume:
        revolutions * distancePerRevolution * (1 - suppliedSlip) * mouthArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    revolutions: 100,
    distancePerRevolution: 0.1,
    suppliedSlip: 0.2,
    mouthArea: 0.5,
  },
  output: { distance: 8, filteredVolume: 4 },
} satisfies ToolExample<Input, Output>;
export const planktonFlowmeterSlipFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/plankton-flowmeter-slip-factor",
    title: "Plankton Flowmeter Slip Factor Tool",
    description:
      "Calculate plankton flowmeter slip factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revolutions: { type: "number", minimum: 0 },
        distancePerRevolution: { type: "number", minimum: 0 },
        suppliedSlip: { type: "number", minimum: 0, maximum: 1 },
        mouthArea: { type: "number", minimum: 0 },
      },
      required: [
        "revolutions",
        "distancePerRevolution",
        "suppliedSlip",
        "mouthArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        filteredVolume: { type: "number" },
      },
      required: ["distance", "filteredVolume"],
    },
    ports: {
      inputs: [
        {
          id: "revolutions",
          label: "Revolutions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distancePerRevolution",
          label: "Distance Per Revolution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSlip",
          label: "Supplied Slip",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mouthArea",
          label: "Mouth Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "filteredVolume",
          label: "Filtered Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planktonFlowmeterSlipFactorTool.execute;
export default planktonFlowmeterSlipFactorTool;
