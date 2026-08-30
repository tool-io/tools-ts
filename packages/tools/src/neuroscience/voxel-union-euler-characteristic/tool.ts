import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dimensions } from "../shared.js";
export type Input = Readonly<{
  readonly binaryMask: readonly number[];
  readonly dimensions: readonly number[];
}>;
export type Output = Readonly<{
  readonly vertexCount: number;
  readonly edgeCount: number;
  readonly faceCount: number;
  readonly cubeCount: number;
  readonly eulerCharacteristic: number;
}>;
const inputFields = [
  { id: "binaryMask", label: "Binary mask", kind: "numberList" },
  { id: "dimensions", label: "Dimensions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  dimensions(input.dimensions, input.binaryMask.length, 4096);
  if (input.binaryMask.some((v) => v !== 0 && v !== 1))
    simpleError("binaryMask", "Binary mask required.");
  const [nx, ny] = input.dimensions,
    vertices = new Set<string>(),
    edges = new Set<string>(),
    faces = new Set<string>();
  let cubeCount = 0;
  for (let i = 0; i < input.binaryMask.length; i++)
    if (input.binaryMask[i]) {
      cubeCount++;
      const x = i % nx,
        y = Math.floor(i / nx) % ny,
        z = Math.floor(i / (nx * ny));
      for (let dx = 0; dx <= 1; dx++)
        for (let dy = 0; dy <= 1; dy++)
          for (let dz = 0; dz <= 1; dz++)
            vertices.add(`${x + dx},${y + dy},${z + dz}`);
      for (let dy = 0; dy <= 1; dy++)
        for (let dz = 0; dz <= 1; dz++) edges.add(`x:${x},${y + dy},${z + dz}`);
      for (let dx = 0; dx <= 1; dx++)
        for (let dz = 0; dz <= 1; dz++) edges.add(`y:${x + dx},${y},${z + dz}`);
      for (let dx = 0; dx <= 1; dx++)
        for (let dy = 0; dy <= 1; dy++) edges.add(`z:${x + dx},${y + dy},${z}`);
      for (let d = 0; d <= 1; d++) {
        faces.add(`x:${x + d},${y},${z}`);
        faces.add(`y:${x},${y + d},${z}`);
        faces.add(`z:${x},${y},${z + d}`);
      }
    }
  return {
    vertexCount: vertices.size,
    edgeCount: edges.size,
    faceCount: faces.size,
    cubeCount,
    eulerCharacteristic: vertices.size - edges.size + faces.size - cubeCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  binaryMask: [1, 1],
  dimensions: [2, 1, 1],
} satisfies Input;
export const exampleOutput = {
  vertexCount: 12,
  edgeCount: 20,
  faceCount: 11,
  cubeCount: 2,
  eulerCharacteristic: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/voxel-union-euler-characteristic",
  title: "Euler Characteristic",
  description:
    "Count the unique cells of the union of closed voxel cubes and compute V−E+F−C; edge/corner contacts share cells, unlike a six-connected component convention.",
  inputs: inputFields,
  outputs: [
    { id: "vertexCount", label: "Vertex count", kind: "number" },
    { id: "edgeCount", label: "Edge count", kind: "number" },
    { id: "faceCount", label: "Face count", kind: "number" },
    { id: "cubeCount", label: "Cube count", kind: "number" },
    {
      id: "eulerCharacteristic",
      label: "Euler characteristic",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      binaryMask: value.binaryMask as readonly number[],
      dimensions: value.dimensions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
