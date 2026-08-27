import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApiGravityInput = {
  readonly specificGravity: number;
};

export type ApiGravityOutput = {
  readonly apiGravity: number;
};

export const calculateApiGravity = (
  input: ApiGravityInput,
): ApiGravityOutput => {
  if (!(input.specificGravity > 0))
    simpleError(
      "specificGravity",
      "Specific gravity must be greater than zero.",
      "invalid_gravity",
    );
  return { apiGravity: 141.5 / input.specificGravity - 131.5 };
};

export const apiGravityExample = {
  input: { specificGravity: 0.876 },
  output: { apiGravity: 30.029680365296798 },
} satisfies ToolExample<ApiGravityInput, ApiGravityOutput>;

export const apiGravityTool = createSimpleTool({
  id: "geology/api-gravity",
  title: "API Gravity Calculator",
  description:
    "Convert the specific gravity of crude oil at 60 degrees Fahrenheit to API gravity.",
  inputs: [
    {
      description: "Oil specific gravity relative to water at 60 °F.",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "API gravity in degrees API.",
      id: "apiGravity",
      kind: "number",
      label: "API gravity",
    },
  ],
  calculate: (input) =>
    calculateApiGravity(input as unknown as ApiGravityInput),
});

export const runApiGravity = apiGravityTool.execute;
export default apiGravityTool;
