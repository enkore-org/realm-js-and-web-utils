import * as ts from "typescript"
import path from "node:path"
import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {convertFunctionDeclaration} from "../utils/convertFunctionDeclaration.mjs"
import {getTypesReferencedInNode} from "../utils/getTypesReferencedInNode.mjs"
import {getTopLevelTypes} from "../utils/getTopLevelTypes.mjs"
import {resolveTopLevelTypesRecursively} from "../utils/resolveTopLevelTypesRecursively.mjs"

export function generateFunctionCode(
	source: TsGenerateFunctionFactoryCodeSource,
	implementation: ts.FunctionDeclaration
) : string {
	const function_name = path.basename(source.output.fn).slice(0, -4)
	const factory_name = path.basename(source.output.factory).slice(0, -4)

	const fn = convertFunctionDeclaration(implementation)
	const used_types = getTypesReferencedInNode(implementation, [
		...fn.type_params.map(type => type.name),
		"AnioJsDependencies",
		"RuntimeWrappedContextInstance"
	])
	const top_level_types = getTopLevelTypes(implementation.getSourceFile())

	const is_async = fn.modifiers.includes("async")

	let code = ``

	code += `import {createDefaultContext} from "@fourtune/realm-js/v0/runtime"\n`

	const resolved_types = resolveTopLevelTypesRecursively(
		top_level_types, used_types, true
	)

	if (resolved_types.length) {
		code += `// vvv types needed for function signature\n`
		code += resolved_types
		code += `// ^^^ types needed for function signature\n`
		code += `\n`
	}

	code += `import {${factory_name} as factory} from "${path.join("#~auto", source.output.factory)}"\n`
	code += `\n`
	code += `const fn = factory(createDefaultContext())\n`
	code += `\n`

	if (fn.jsdoc.length) {
		code += fn.jsdoc + "\n"
	}

	code += `export ${is_async ? "async " : ""}function ${function_name}${fn.type_params_definition}(${fn.params.slice(2).map(param => param.definition).join(", ")}) : ${fn.return_type} {\n`
	code += `\treturn ${is_async ? "await " : ""}fn(${fn.params.slice(2).map(param => param.name).join(", ")})\n`
	code += `}\n`

	return code
}
