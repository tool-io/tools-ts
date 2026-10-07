import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumetricFlow: number;
  readonly referenceVolume: number;
};
export type Output = {
  readonly spaceVelocity: number;
  readonly spaceTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumetricFlow: { type: "number", exclusiveMinimum: 0 },
    referenceVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumetricFlow", "referenceVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaceVelocity: { type: "number" },
    spaceTime: { type: "number" },
  },
  required: ["spaceVelocity", "spaceTime"],
} as const;
/** Crosswalk volumetric space velocity and nominal space time using one explicit positive flow and consistently defined reference volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumetricFlow, referenceVolume } = request;
  const compute = (): Output => {
    (H.domain(volumetricFlow > 0, "volumetricFlow"), volumetricFlow);
    (H.domain(referenceVolume > 0, "referenceVolume"), referenceVolume);
    return {
      spaceVelocity: volumetricFlow / referenceVolume,
      spaceTime: referenceVolume / volumetricFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumetricFlow: 20, referenceVolume: 5 },
  output: { spaceVelocity: 4, spaceTime: 0.25 },
} satisfies ToolExample<Input, Output>;
export const reactorSpaceVelocityTimeCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/reactor-space-velocity-time-crosswalk",
    title: "Reactor Space Velocity Time Crosswalk",
    description:
      "Crosswalk volumetric space velocity and nominal space time using one explicit positive flow and consistently defined reference volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumetricFlow: { type: "number", exclusiveMinimum: 0 },
        referenceVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumetricFlow", "referenceVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spaceVelocity: { type: "number" },
        spaceTime: { type: "number" },
      },
      required: ["spaceVelocity", "spaceTime"],
    },
    ports: {
      inputs: [
        {
          id: "volumetricFlow",
          label: "Volumetric Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spaceVelocity",
          label: "Space Velocity",
          valueType: { type: "number" },
        },
        { id: "spaceTime", label: "Space Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reactorSpaceVelocityTimeCrosswalkTool.execute;
export default reactorSpaceVelocityTimeCrosswalkTool;
