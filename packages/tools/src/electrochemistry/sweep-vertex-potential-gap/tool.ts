import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startPotential: number;
  readonly vertexPotential: number;
  readonly endPotential: number;
};
export type Output = {
  readonly outgoingStep: number;
  readonly returnStep: number;
  readonly closes: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPotential: { type: "number" },
    vertexPotential: { type: "number" },
    endPotential: { type: "number" },
  },
  required: ["startPotential", "vertexPotential", "endPotential"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgoingStep: { type: "number" },
    returnStep: { type: "number" },
    closes: { type: "boolean" },
  },
  required: ["outgoingStep", "returnStep", "closes"],
} as const;
/** Calculate sweep vertex potential gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startPotential, vertexPotential, endPotential } = request;
  const compute = (): Output => {
    return {
      outgoingStep: vertexPotential - startPotential,
      returnStep: endPotential - vertexPotential,
      closes: startPotential === endPotential,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startPotential: 0, vertexPotential: 2, endPotential: 0 },
  output: { outgoingStep: 2, returnStep: -2, closes: true },
} satisfies ToolExample<Input, Output>;
export const sweepVertexPotentialGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/sweep-vertex-potential-gap",
    title: "Sweep Vertex Potential Gap Tool",
    description:
      "Calculate sweep vertex potential gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPotential: { type: "number" },
        vertexPotential: { type: "number" },
        endPotential: { type: "number" },
      },
      required: ["startPotential", "vertexPotential", "endPotential"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outgoingStep: { type: "number" },
        returnStep: { type: "number" },
        closes: { type: "boolean" },
      },
      required: ["outgoingStep", "returnStep", "closes"],
    },
    ports: {
      inputs: [
        {
          id: "startPotential",
          label: "Start Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vertexPotential",
          label: "Vertex Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endPotential",
          label: "End Potential",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outgoingStep",
          label: "Outgoing Step",
          valueType: { type: "number" },
        },
        {
          id: "returnStep",
          label: "Return Step",
          valueType: { type: "number" },
        },
        { id: "closes", label: "Closes", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sweepVertexPotentialGapTool.execute;
export default sweepVertexPotentialGapTool;
