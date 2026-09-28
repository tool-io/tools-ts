import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly remaining: number;
  readonly spilled: number;
};
export type Output = { readonly loggedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    remaining: { type: "number", minimum: 0 },
    spilled: { type: "number", minimum: 0 },
  },
  required: ["capacity", "remaining", "spilled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loggedVolume: { type: "number" } },
  required: ["loggedVolume"],
} as const;
/** Subtract explicitly recorded remaining and spilled liquid from a container entry; no hydration target is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, remaining, spilled } = request;
  const compute = (): Output => {
    H.domain(
      capacity >= 0 &&
        remaining >= 0 &&
        spilled >= 0 &&
        remaining + spilled <= capacity,
    );
    return { loggedVolume: capacity - remaining - spilled };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 500, remaining: 100, spilled: 50 },
  output: { loggedVolume: 350 },
} satisfies ToolExample<Input, Output>;
export const hydrationEntryContainerNetvolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/hydration-entry-container-netvolume",
    title: "Hydration Entry Container Netvolume Tool",
    description:
      "Subtract explicitly recorded remaining and spilled liquid from a container entry; no hydration target is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        remaining: { type: "number", minimum: 0 },
        spilled: { type: "number", minimum: 0 },
      },
      required: ["capacity", "remaining", "spilled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loggedVolume: { type: "number" } },
      required: ["loggedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remaining",
          label: "Remaining",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spilled",
          label: "Spilled",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loggedVolume",
          label: "Logged Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydrationEntryContainerNetvolumeTool.execute;
export default hydrationEntryContainerNetvolumeTool;
