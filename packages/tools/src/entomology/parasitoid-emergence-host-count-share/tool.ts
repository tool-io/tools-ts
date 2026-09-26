import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emergedHosts: number;
  readonly exposedHosts: number;
  readonly parasitoids: number;
};
export type Output = {
  readonly hostEmergenceFraction: number;
  readonly parasitoidsPerEmergingHost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emergedHosts: { type: "integer", minimum: 1 },
    exposedHosts: { type: "integer", minimum: 1 },
    parasitoids: { type: "integer" },
  },
  required: ["emergedHosts", "exposedHosts", "parasitoids"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hostEmergenceFraction: { type: "number" },
    parasitoidsPerEmergingHost: { type: "number" },
  },
  required: ["hostEmergenceFraction", "parasitoidsPerEmergingHost"],
} as const;
/** Host-level emergence incidence and brood size are distinct; multiple parasitoids per host remain valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emergedHosts, exposedHosts, parasitoids } = request;
  const compute = (): Output => {
    H.integer(exposedHosts, 1);
    H.integer(emergedHosts, 1, exposedHosts);
    H.integer(parasitoids, emergedHosts);
    return {
      hostEmergenceFraction: emergedHosts / exposedHosts,
      parasitoidsPerEmergingHost: parasitoids / emergedHosts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emergedHosts: 20, exposedHosts: 50, parasitoids: 60 },
  output: { hostEmergenceFraction: 0.4, parasitoidsPerEmergingHost: 3 },
} satisfies ToolExample<Input, Output>;
export const parasitoidEmergenceHostCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/parasitoid-emergence-host-count-share",
    title: "Parasitoid Emergence Host Count Share Tool",
    description:
      "Host-level emergence incidence and brood size are distinct; multiple parasitoids per host remain valid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emergedHosts: { type: "integer", minimum: 1 },
        exposedHosts: { type: "integer", minimum: 1 },
        parasitoids: { type: "integer" },
      },
      required: ["emergedHosts", "exposedHosts", "parasitoids"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hostEmergenceFraction: { type: "number" },
        parasitoidsPerEmergingHost: { type: "number" },
      },
      required: ["hostEmergenceFraction", "parasitoidsPerEmergingHost"],
    },
    ports: {
      inputs: [
        {
          id: "emergedHosts",
          label: "Emerged Hosts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exposedHosts",
          label: "Exposed Hosts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parasitoids",
          label: "Parasitoids",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "hostEmergenceFraction",
          label: "Host Emergence Fraction",
          valueType: { type: "number" },
        },
        {
          id: "parasitoidsPerEmergingHost",
          label: "Parasitoids Per Emerging Host",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = parasitoidEmergenceHostCountShareTool.execute;
export default parasitoidEmergenceHostCountShareTool;
