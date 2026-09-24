import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly driftPerTime: number;
  readonly initialOffset: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    driftPerTime: { type: "number" },
    initialOffset: { type: "number" },
  },
  required: ["elapsed", "driftPerTime", "initialOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate camera observation clock drift term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, driftPerTime, initialOffset } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0);
    return { offset: initialOffset + elapsed * driftPerTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 1000, driftPerTime: 0.001, initialOffset: 2 },
  output: { offset: 3 },
} satisfies ToolExample<Input, Output>;
export const cameraObservationClockDriftTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/camera-observation-clock-drift-term",
    title: "Camera Observation Clock Drift Term Tool",
    description:
      "Calculate camera observation clock drift term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        driftPerTime: { type: "number" },
        initialOffset: { type: "number" },
      },
      required: ["elapsed", "driftPerTime", "initialOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPerTime",
          label: "Drift Per Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialOffset",
          label: "Initial Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cameraObservationClockDriftTermTool.execute;
export default cameraObservationClockDriftTermTool;
