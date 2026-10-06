import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialJointWidth: number;
  readonly suppliedClosingExpansion: number;
};
export type Output = {
  readonly remainingOpenWidth: number;
  readonly closedOrOverlapped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialJointWidth: { type: "number", minimum: 0 },
    suppliedClosingExpansion: { type: "number" },
  },
  required: ["initialJointWidth", "suppliedClosingExpansion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingOpenWidth: { type: "number" },
    closedOrOverlapped: { type: "boolean" },
  },
  required: ["remainingOpenWidth", "closedOrOverlapped"],
} as const;
/** Subtract an explicitly supplied signed thermal closing displacement from joint width without estimating expansion or code compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialJointWidth, suppliedClosingExpansion } = request;
  const compute = (): Output => {
    H.domain(initialJointWidth >= 0, "initialJointWidth");
    return {
      remainingOpenWidth: initialJointWidth - suppliedClosingExpansion,
      closedOrOverlapped: suppliedClosingExpansion >= initialJointWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialJointWidth: 12, suppliedClosingExpansion: 3 },
  output: { remainingOpenWidth: 9, closedOrOverlapped: false },
} satisfies ToolExample<Input, Output>;
export const facadeJointOpenWidthThermalDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/facade-joint-open-width-thermal-delta",
    title: "Facade Joint Open Width Thermal Delta",
    description:
      "Subtract an explicitly supplied signed thermal closing displacement from joint width without estimating expansion or code compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialJointWidth: { type: "number", minimum: 0 },
        suppliedClosingExpansion: { type: "number" },
      },
      required: ["initialJointWidth", "suppliedClosingExpansion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingOpenWidth: { type: "number" },
        closedOrOverlapped: { type: "boolean" },
      },
      required: ["remainingOpenWidth", "closedOrOverlapped"],
    },
    ports: {
      inputs: [
        {
          id: "initialJointWidth",
          label: "Initial Joint Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClosingExpansion",
          label: "Supplied Closing Expansion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingOpenWidth",
          label: "Remaining Open Width",
          valueType: { type: "number" },
        },
        {
          id: "closedOrOverlapped",
          label: "Closed Or Overlapped",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = facadeJointOpenWidthThermalDeltaTool.execute;
export default facadeJointOpenWidthThermalDeltaTool;
