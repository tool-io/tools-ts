import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionCoordinate: number;
  readonly suppliedOrigin: number;
  readonly reverseAxis: boolean;
};
export type Output = { readonly relativeCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionCoordinate: { type: "number" },
    suppliedOrigin: { type: "number" },
    reverseAxis: { type: "boolean" },
  },
  required: ["sectionCoordinate", "suppliedOrigin", "reverseAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeCoordinate: { type: "number" } },
  required: ["relativeCoordinate"],
} as const;
/** Relabel a supplied canal-phantom section coordinate without working-length or treatment guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionCoordinate, suppliedOrigin, reverseAxis } = request;
  const compute = (): Output => {
    return {
      relativeCoordinate:
        (sectionCoordinate - suppliedOrigin) * (reverseAxis ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectionCoordinate: 12, suppliedOrigin: 5, reverseAxis: true },
  output: { relativeCoordinate: -7 },
} satisfies ToolExample<Input, Output>;
export const canalModelSectionOriginTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/canal-model-section-origin-token",
    title: "Canal Model Section Origin Token Tool",
    description:
      "Relabel a supplied canal-phantom section coordinate without working-length or treatment guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionCoordinate: { type: "number" },
        suppliedOrigin: { type: "number" },
        reverseAxis: { type: "boolean" },
      },
      required: ["sectionCoordinate", "suppliedOrigin", "reverseAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeCoordinate: { type: "number" } },
      required: ["relativeCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "sectionCoordinate",
          label: "Section Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOrigin",
          label: "Supplied Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "relativeCoordinate",
          label: "Relative Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canalModelSectionOriginTokenTool.execute;
export default canalModelSectionOriginTokenTool;
