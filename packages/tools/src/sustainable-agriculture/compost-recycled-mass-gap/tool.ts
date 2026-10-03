import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly recycledMass: number;
  readonly outputMass: number;
  readonly lossMass: number;
};
export type Output = {
  readonly netNewInput: number;
  readonly closureGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", minimum: 0 },
    recycledMass: { type: "number", minimum: 0 },
    outputMass: { type: "number", minimum: 0 },
    lossMass: { type: "number", minimum: 0 },
  },
  required: ["inputMass", "recycledMass", "outputMass", "lossMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netNewInput: { type: "number" },
    closureGap: { type: "number" },
  },
  required: ["netNewInput", "closureGap"],
} as const;
/** One-boundary supplied mass ledger with recycled input excluded; no compost processing prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, recycledMass, outputMass, lossMass } = request;
  const compute = (): Output => {
    H.domain(
      inputMass >= 0 &&
        recycledMass >= 0 &&
        recycledMass <= inputMass &&
        outputMass >= 0 &&
        lossMass >= 0,
    );
    return {
      netNewInput: inputMass - recycledMass,
      closureGap: inputMass - recycledMass - outputMass - lossMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputMass: 100, recycledMass: 20, outputMass: 60, lossMass: 15 },
  output: { netNewInput: 80, closureGap: 5 },
} satisfies ToolExample<Input, Output>;
export const compostRecycledMassGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/compost-recycled-mass-gap",
    title: "Compost Recycled Mass Gap Tool",
    description:
      "One-boundary supplied mass ledger with recycled input excluded; no compost processing prescription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", minimum: 0 },
        recycledMass: { type: "number", minimum: 0 },
        outputMass: { type: "number", minimum: 0 },
        lossMass: { type: "number", minimum: 0 },
      },
      required: ["inputMass", "recycledMass", "outputMass", "lossMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netNewInput: { type: "number" },
        closureGap: { type: "number" },
      },
      required: ["netNewInput", "closureGap"],
    },
    ports: {
      inputs: [
        {
          id: "inputMass",
          label: "Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recycledMass",
          label: "Recycled Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputMass",
          label: "Output Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossMass",
          label: "Loss Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netNewInput",
          label: "Net New Input",
          valueType: { type: "number" },
        },
        {
          id: "closureGap",
          label: "Closure Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compostRecycledMassGapTool.execute;
export default compostRecycledMassGapTool;
