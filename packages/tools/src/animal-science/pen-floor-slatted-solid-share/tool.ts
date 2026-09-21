import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly slattedArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly usableArea: number;
  readonly slattedFraction: number;
  readonly solidArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number" },
    slattedArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "slattedArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableArea: { type: "number" },
    slattedFraction: { type: "number" },
    solidArea: { type: "number" },
  },
  required: ["usableArea", "slattedFraction", "solidArea"],
} as const;
/** Calculate pen floor slatted solid share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, slattedArea, excludedArea } = request;
  const compute = (): Output => {
    H.domain(
      excludedArea >= 0 &&
        totalArea > excludedArea &&
        slattedArea >= 0 &&
        slattedArea <= totalArea - excludedArea,
    );
    return {
      usableArea: totalArea - excludedArea,
      slattedFraction: slattedArea / (totalArea - excludedArea),
      solidArea: totalArea - excludedArea - slattedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 100, slattedArea: 30, excludedArea: 10 },
  output: {
    usableArea: 90,
    slattedFraction: 0.3333333333333333,
    solidArea: 60,
  },
} satisfies ToolExample<Input, Output>;
export const penFloorSlattedSolidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/pen-floor-slatted-solid-share",
    title: "Pen Floor Slatted Solid Share Tool",
    description:
      "Calculate pen floor slatted solid share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number" },
        slattedArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "slattedArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        slattedFraction: { type: "number" },
        solidArea: { type: "number" },
      },
      required: ["usableArea", "slattedFraction", "solidArea"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slattedArea",
          label: "Slatted Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        {
          id: "slattedFraction",
          label: "Slatted Fraction",
          valueType: { type: "number" },
        },
        { id: "solidArea", label: "Solid Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = penFloorSlattedSolidShareTool.execute;
export default penFloorSlattedSolidShareTool;
