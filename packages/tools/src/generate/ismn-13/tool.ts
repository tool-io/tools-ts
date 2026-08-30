import { ismn13Generator as config } from "../../standard-identifiers/presets.js";
import { createIdentifierGeneratorModule } from "../../standard-identifiers/shared.js";
const module = createIdentifierGeneratorModule(config);
export const example = module.example;
export const identifierGeneratorTool = module.tool;
export const runIdentifierGenerator = module.run;
export default identifierGeneratorTool;
