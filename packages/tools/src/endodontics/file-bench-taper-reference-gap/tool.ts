import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tipDiameter: number;
  readonly taperPerLength: number;
  readonly distanceFromTip: number;
  readonly measuredDiameter: number;
};
export type Output = { readonly nominalDiameter: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipDiameter: { type: "number", minimum: 0 },
    taperPerLength: { type: "number", minimum: 0 },
    distanceFromTip: { type: "number", minimum: 0 },
    measuredDiameter: { type: "number", minimum: 0 },
  },
  required: [
    "tipDiameter",
    "taperPerLength",
    "distanceFromTip",
    "measuredDiameter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nominalDiameter: { type: "number" }, gap: { type: "number" } },
  required: ["nominalDiameter", "gap"],
} as const;
/** Compare supplied bench file dimensions against an explicitly linear taper model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tipDiameter, taperPerLength, distanceFromTip, measuredDiameter } =
    request;
  const compute = (): Output => {
    H.domain(
      tipDiameter >= 0 &&
        taperPerLength >= 0 &&
        distanceFromTip >= 0 &&
        measuredDiameter >= 0,
    );
    return {
      nominalDiameter: tipDiameter + taperPerLength * distanceFromTip,
      gap: measuredDiameter - tipDiameter - taperPerLength * distanceFromTip,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tipDiameter: 0.2,
    taperPerLength: 0.05,
    distanceFromTip: 4,
    measuredDiameter: 0.5,
  },
  output: { nominalDiameter: 0.4, gap: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const fileBenchTaperReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/file-bench-taper-reference-gap",
    title: "File Bench Taper Reference Gap Tool",
    description:
      "Compare supplied bench file dimensions against an explicitly linear taper model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipDiameter: { type: "number", minimum: 0 },
        taperPerLength: { type: "number", minimum: 0 },
        distanceFromTip: { type: "number", minimum: 0 },
        measuredDiameter: { type: "number", minimum: 0 },
      },
      required: [
        "tipDiameter",
        "taperPerLength",
        "distanceFromTip",
        "measuredDiameter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDiameter: { type: "number" },
        gap: { type: "number" },
      },
      required: ["nominalDiameter", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "tipDiameter",
          label: "Tip Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taperPerLength",
          label: "Taper Per Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distanceFromTip",
          label: "Distance From Tip",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredDiameter",
          label: "Measured Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalDiameter",
          label: "Nominal Diameter",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fileBenchTaperReferenceGapTool.execute;
export default fileBenchTaperReferenceGapTool;
