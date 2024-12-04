import ts from "typescript"
import type {TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source as Source} from "@fourtune/types/base-realm-js-and-web/v0"

import {
	parseCode,
	getExportByName,
	convertFunctionDeclaration
} from "@aniojs/node-ts-utils"

import {getAnioJsDependencies} from "./getAnioJsDependencies.mjs"

export async function tsGenerateFunctionFactoryCodeForRealmJSAndWebV0(
	project_root: string,
	source: Source|([Source, Source]),
	code: string,
	expect_async_implementation: boolean|null
) : Promise<{
	factory: string,
	fn: string
}> {
	const inst = parseCode(code)

	const implementation = getExportByName(inst, "implementation", "value-only")

	if (!implementation) {
		throw new Error(`Unable to find 'implementation' export.`)
	} else if (!ts.isFunctionDeclaration(implementation.node)) {
		throw new Error(`'implementation' export must be a function declaration.`)
	}

	const fn = convertFunctionDeclaration(implementation.node)

	const implementation_is_async = fn.modifiers.includes("async")

	if (expect_async_implementation && !implementation_is_async) {
		throw new Error(`Expected implementation to be asynchronous.`)
	} else if (!expect_async_implementation && implementation_is_async) {
		throw new Error(`Expected implementation to be synchronous.`)
	}

	if (!fn.params.length) {
		throw new Error(`implementation must have at least one parameter.`)
	}

	if (fn.params[0].type !== "RuntimeWrappedContextInstance") {
		throw new Error(`First parameter of implementation must be of type 'RuntimeWrappedContextInstance'.`)
	}

	if (fn.params.length >= 2 && fn.params[1].type !== "AnioJsDependencies") {
		throw new Error(`Second parameter of implementation must be of type 'AnioJsDependencies'.`)
	}

	let anio_js_dependencies : false|any[] = false

	if (fn.params.length >= 2) {
		anio_js_dependencies = getAnioJsDependencies(
			project_root, inst
		)

		if (anio_js_dependencies === false) {
			throw new Error(`Unable to process AnioJsDependencies.`)
		}
	}

	return {
		factory: ``,
		fn: ``
	}
}
