import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bridgeWidth: number;
  readonly supportWidth: number;
  readonly padIntrusion: number;
  readonly asymmetry: number;
};
export type Output = {
  readonly totalClearance: number;
  readonly leftGap: number;
  readonly rightGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bridgeWidth: { type: "number", minimum: 0 },
    supportWidth: { type: "number", minimum: 0 },
    padIntrusion: { type: "number", minimum: 0 },
    asymmetry: { type: "number" },
  },
  required: ["bridgeWidth", "supportWidth", "padIntrusion", "asymmetry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalClearance: { type: "number" },
    leftGap: { type: "number" },
    rightGap: { type: "number" },
  },
  required: ["totalClearance", "leftGap", "rightGap"],
} as const;
/** Audit explicit planar bridge/support dimensions without a fitting recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bridgeWidth, supportWidth, padIntrusion, asymmetry } = request;
  const compute = (): Output => {
    H.domain(bridgeWidth >= 0 && supportWidth >= 0 && padIntrusion >= 0);
    return {
      totalClearance: bridgeWidth - supportWidth - 2 * padIntrusion,
      leftGap: (bridgeWidth - supportWidth) / 2 - padIntrusion - asymmetry,
      rightGap: (bridgeWidth - supportWidth) / 2 - padIntrusion + asymmetry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bridgeWidth: 24, supportWidth: 16, padIntrusion: 1, asymmetry: 0.5 },
  output: { totalClearance: 6, leftGap: 2.5, rightGap: 3.5 },
} satisfies ToolExample<Input, Output>;
export const spectacleBridgeFitClearanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/spectacle-bridge-fit-clearance-term",
    title: "Spectacle Bridge Fit Clearance Term Tool",
    description:
      "Audit explicit planar bridge/support dimensions without a fitting recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bridgeWidth: { type: "number", minimum: 0 },
        supportWidth: { type: "number", minimum: 0 },
        padIntrusion: { type: "number", minimum: 0 },
        asymmetry: { type: "number" },
      },
      required: ["bridgeWidth", "supportWidth", "padIntrusion", "asymmetry"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalClearance: { type: "number" },
        leftGap: { type: "number" },
        rightGap: { type: "number" },
      },
      required: ["totalClearance", "leftGap", "rightGap"],
    },
    ports: {
      inputs: [
        {
          id: "bridgeWidth",
          label: "Bridge Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supportWidth",
          label: "Support Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "padIntrusion",
          label: "Pad Intrusion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "asymmetry",
          label: "Asymmetry",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalClearance",
          label: "Total Clearance",
          valueType: { type: "number" },
        },
        { id: "leftGap", label: "Left Gap", valueType: { type: "number" } },
        { id: "rightGap", label: "Right Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = spectacleBridgeFitClearanceTermTool.execute;
export default spectacleBridgeFitClearanceTermTool;
