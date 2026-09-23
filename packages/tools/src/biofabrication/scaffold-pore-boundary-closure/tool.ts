import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly poreSizes: readonly number[];
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = { readonly matchingPositions: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreSizes: { type: "array", maxItems: 256, items: { type: "number" } },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["poreSizes", "lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["matchingPositions"],
} as const;
/** Apply explicit supplied geometric pore-size range boundaries without selecting a scaffold design. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { poreSizes, lower, upper, lowerClosed, upperClosed } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      matchingPositions: poreSizes.flatMap((x, i) =>
        (lowerClosed ? x >= lower : x > lower) &&
        (upperClosed ? x <= upper : x < upper)
          ? [i]
          : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    poreSizes: [1, 2, 3],
    lower: 1,
    upper: 3,
    lowerClosed: true,
    upperClosed: false,
  },
  output: { matchingPositions: [0, 1] },
} satisfies ToolExample<Input, Output>;
export const scaffoldPoreBoundaryClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/scaffold-pore-boundary-closure",
    title: "Scaffold Pore Boundary Closure Tool",
    description:
      "Apply explicit supplied geometric pore-size range boundaries without selecting a scaffold design.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreSizes: { type: "array", maxItems: 256, items: { type: "number" } },
        lower: { type: "number" },
        upper: { type: "number" },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
      },
      required: ["poreSizes", "lower", "upper", "lowerClosed", "upperClosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchingPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["matchingPositions"],
    },
    ports: {
      inputs: [
        {
          id: "poreSizes",
          label: "Pore Sizes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerClosed",
          label: "Lower Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperClosed",
          label: "Upper Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "matchingPositions",
          label: "Matching Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldPoreBoundaryClosureTool.execute;
export default scaffoldPoreBoundaryClosureTool;
