import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly reference: string };
export type Output = {
  readonly image: string;
  readonly tag: string;
  readonly tagged: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    image: { type: "string", maxLength: 8192 },
    tag: { type: "string", maxLength: 8192 },
    tagged: { type: "boolean" },
  },
  required: ["image", "tag", "tagged"],
} as const;
/** Compute docker image tag colon boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { reference } = input;
  const compute = (): Output => {
    domain(
      reference.length > 0 && !reference.includes("@") && !/\s/.test(reference),
    );
    const colon = reference.lastIndexOf(":"),
      slash = reference.lastIndexOf("/"),
      tagged = colon > slash;
    return {
      image: tagged ? reference.slice(0, colon) : reference,
      tag: tagged ? reference.slice(colon + 1) : "",
      tagged,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { reference: "localhost:5000/app:latest" },
  output: { image: "localhost:5000/app", tag: "latest", tagged: true },
} satisfies ToolExample<Input, Output>;
export const dockerImageTagColonBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/docker-image-tag-colon-boundary",
  title: "Docker Image Tag Colon Boundary Tool",
  description:
    "Compute docker image tag colon boundary from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "reference",
        label: "Reference",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "image", label: "Image", valueType: { type: "string" } },
      { id: "tag", label: "Tag", valueType: { type: "string" } },
      { id: "tagged", label: "Tagged", valueType: { type: "boolean" } },
    ],
  },
});
export const run = dockerImageTagColonBoundaryTool.execute;
export default dockerImageTagColonBoundaryTool;
