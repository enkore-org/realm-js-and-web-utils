// @ts-ignore:next-line
import babel from "@babel/core"
// @ts-ignore:next-line
import presetTypeScript from "@babel/preset-typescript"

type Options = {
	filename?: string
	rewriteImportExtensions?: boolean
}

export async function stripTypes(
	code: string, {
		filename = "index.mts",
		rewriteImportExtensions = true
	}: Options = {}
): Promise<string> {
	if (!filename.endsWith(".mts")) {
		throw new Error(
			`Filename must end with ".mts".`
		)
	}

	const options = {
		presets: [
			[presetTypeScript, {
				rewriteImportExtensions
			}]
		],
		filename: filename
	}

	const result = await babel.transformAsync(
		code, options
	)

	return result.code
}
