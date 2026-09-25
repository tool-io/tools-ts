import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topDepth: number;
  readonly bottomDepth: number;
  readonly datumElevation: number;
  readonly depthPositiveDown: boolean;
};
export type Output = {
  readonly topElevation: number;
  readonly bottomElevation: number;
  readonly signedThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number" },
    bottomDepth: { type: "number" },
    datumElevation: { type: "number" },
    depthPositiveDown: { type: "boolean" },
  },
  required: ["topDepth", "bottomDepth", "datumElevation", "depthPositiveDown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topElevation: { type: "number" },
    bottomElevation: { type: "number" },
    signedThickness: { type: "number" },
  },
  required: ["topElevation", "bottomElevation", "signedThickness"],
} as const;
/** Convert supplied depth coordinates to elevations under an explicit axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth, datumElevation, depthPositiveDown } = request;
  const compute = (): Output => {
    return {
      topElevation: datumElevation + (depthPositiveDown ? -topDepth : topDepth),
      bottomElevation:
        datumElevation + (depthPositiveDown ? -bottomDepth : bottomDepth),
      signedThickness: bottomDepth - topDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    topDepth: 2,
    bottomDepth: 7,
    datumElevation: 100,
    depthPositiveDown: true,
  },
  output: { topElevation: 98, bottomElevation: 93, signedThickness: 5 },
} satisfies ToolExample<Input, Output>;
export const coreTopBottomDatumSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/core-top-bottom-datum-sign",
    title: "Core Top Bottom Datum Sign Tool",
    description:
      "Convert supplied depth coordinates to elevations under an explicit axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topDepth: { type: "number" },
        bottomDepth: { type: "number" },
        datumElevation: { type: "number" },
        depthPositiveDown: { type: "boolean" },
      },
      required: [
        "topDepth",
        "bottomDepth",
        "datumElevation",
        "depthPositiveDown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topElevation: { type: "number" },
        bottomElevation: { type: "number" },
        signedThickness: { type: "number" },
      },
      required: ["topElevation", "bottomElevation", "signedThickness"],
    },
    ports: {
      inputs: [
        {
          id: "topDepth",
          label: "Top Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomDepth",
          label: "Bottom Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "datumElevation",
          label: "Datum Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthPositiveDown",
          label: "Depth Positive Down",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "topElevation",
          label: "Top Elevation",
          valueType: { type: "number" },
        },
        {
          id: "bottomElevation",
          label: "Bottom Elevation",
          valueType: { type: "number" },
        },
        {
          id: "signedThickness",
          label: "Signed Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coreTopBottomDatumSignTool.execute;
export default coreTopBottomDatumSignTool;
