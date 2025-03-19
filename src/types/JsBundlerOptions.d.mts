export type JsBundlerInputFileType = "mjs" | "dts"

export type JsBundlerPlugin = {
	when: "pre" | "post"
	plugin: any
}

export type JsBundlerOptions = {
	inputFileType?: JsBundlerInputFileType

	minify?: boolean
	treeshake?: boolean
	externals?: string[]

	additionalPlugins?: JsBundlerPlugin[]
	onRollupLogFunction?: ((...args: any[]) => any)|undefined
}
