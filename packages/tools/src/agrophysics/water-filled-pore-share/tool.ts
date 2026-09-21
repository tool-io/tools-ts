import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterVolume: number;
  readonly poreVolume: number;
  readonly inaccessiblePoreVolume: number;
};
export type Output = {
  readonly accessiblePoreVolume: number;
  readonly totalPoreShare: number;
  readonly accessiblePoreShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterVolume: { type: "number", minimum: 0 },
    poreVolume: { type: "number", exclusiveMinimum: 0 },
    inaccessiblePoreVolume: { type: "number", minimum: 0 },
  },
  required: ["waterVolume", "poreVolume", "inaccessiblePoreVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessiblePoreVolume: { type: "number" },
    totalPoreShare: { type: "number" },
    accessiblePoreShare: { type: "number" },
  },
  required: ["accessiblePoreVolume", "totalPoreShare", "accessiblePoreShare"],
} as const;
/** Report total and accessible pore denominators explicitly, allowing apparent accessible saturation above one to remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterVolume, poreVolume, inaccessiblePoreVolume } = request;
  const compute = (): Output => {
    H.positive(poreVolume);
    H.domain(
      inaccessiblePoreVolume >= 0 &&
        inaccessiblePoreVolume < poreVolume &&
        waterVolume >= 0 &&
        waterVolume <= poreVolume,
    );
    return (() => {
      const accessiblePoreVolume = poreVolume - inaccessiblePoreVolume;
      return {
        accessiblePoreVolume,
        totalPoreShare: waterVolume / poreVolume,
        accessiblePoreShare: waterVolume / accessiblePoreVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterVolume: 3, poreVolume: 10, inaccessiblePoreVolume: 4 },
  output: {
    accessiblePoreVolume: 6,
    totalPoreShare: 0.3,
    accessiblePoreShare: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const waterFilledPoreShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/water-filled-pore-share",
    title: "Water Filled Pore Share Tool",
    description:
      "Report total and accessible pore denominators explicitly, allowing apparent accessible saturation above one to remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterVolume: { type: "number", minimum: 0 },
        poreVolume: { type: "number", exclusiveMinimum: 0 },
        inaccessiblePoreVolume: { type: "number", minimum: 0 },
      },
      required: ["waterVolume", "poreVolume", "inaccessiblePoreVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessiblePoreVolume: { type: "number" },
        totalPoreShare: { type: "number" },
        accessiblePoreShare: { type: "number" },
      },
      required: [
        "accessiblePoreVolume",
        "totalPoreShare",
        "accessiblePoreShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "waterVolume",
          label: "Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "poreVolume",
          label: "Pore Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inaccessiblePoreVolume",
          label: "Inaccessible Pore Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "accessiblePoreVolume",
          label: "Accessible Pore Volume",
          valueType: { type: "number" },
        },
        {
          id: "totalPoreShare",
          label: "Total Pore Share",
          valueType: { type: "number" },
        },
        {
          id: "accessiblePoreShare",
          label: "Accessible Pore Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterFilledPoreShareTool.execute;
export default waterFilledPoreShareTool;
