import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planned: number;
  readonly lost: number;
  readonly folded: number;
  readonly readable: number;
};
export type Output = {
  readonly physicallyPresent: number;
  readonly readableFraction: number;
  readonly nonreadablePresent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planned: { type: "integer", minimum: 1 },
    lost: { type: "integer", minimum: 0 },
    folded: { type: "integer", minimum: 0 },
    readable: { type: "integer", minimum: 0 },
  },
  required: ["planned", "lost", "folded", "readable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicallyPresent: { type: "integer" },
    readableFraction: { type: "number" },
    nonreadablePresent: { type: "integer" },
  },
  required: ["physicallyPresent", "readableFraction", "nonreadablePresent"],
} as const;
/** Readable cores exclude lost and folded cores; other present but unreadable cores remain a separate residual count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planned, lost, folded, readable } = request;
  const compute = (): Output => {
    H.integer(planned, 1);
    H.integer(lost, 0, planned);
    H.integer(folded, 0, planned - lost);
    H.integer(readable, 0, planned - lost - folded);
    return {
      physicallyPresent: planned - lost,
      readableFraction: readable / planned,
      nonreadablePresent: planned - lost - readable,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { planned: 100, lost: 10, folded: 5, readable: 80 },
  output: {
    physicallyPresent: 90,
    readableFraction: 0.8,
    nonreadablePresent: 10,
  },
} satisfies ToolExample<Input, Output>;
export const tissueMicroarrayCoreMissingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/tissue-microarray-core-missing-share",
    title: "Tissue Microarray Core Missing Share Tool",
    description:
      "Readable cores exclude lost and folded cores; other present but unreadable cores remain a separate residual count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planned: { type: "integer", minimum: 1 },
        lost: { type: "integer", minimum: 0 },
        folded: { type: "integer", minimum: 0 },
        readable: { type: "integer", minimum: 0 },
      },
      required: ["planned", "lost", "folded", "readable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicallyPresent: { type: "integer" },
        readableFraction: { type: "number" },
        nonreadablePresent: { type: "integer" },
      },
      required: ["physicallyPresent", "readableFraction", "nonreadablePresent"],
    },
    ports: {
      inputs: [
        {
          id: "planned",
          label: "Planned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lost",
          label: "Lost",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "folded",
          label: "Folded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "readable",
          label: "Readable",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "physicallyPresent",
          label: "Physically Present",
          valueType: { type: "integer" },
        },
        {
          id: "readableFraction",
          label: "Readable Fraction",
          valueType: { type: "number" },
        },
        {
          id: "nonreadablePresent",
          label: "Nonreadable Present",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueMicroarrayCoreMissingShareTool.execute;
export default tissueMicroarrayCoreMissingShareTool;
