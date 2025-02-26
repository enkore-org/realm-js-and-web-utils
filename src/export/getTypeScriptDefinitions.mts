import {
	readTSConfigFile,
	emit
} from "@aniojs/node-ts-utils"
import {
	type CompilerOptions as TSCompilerOptions,
	createProgram as tsCreateProgram,
	createCompilerHost as tsCreateCompilerHost
} from "typescript"
import path from "node:path"

type DiagnosticMessage = Awaited<ReturnType<
	typeof emit
>>["diagnosticMessages"][number]

type Ret = {
	emitSkipped: boolean
	diagnosticMessages: DiagnosticMessage[]
	virtualMemoryFS: Map<string, string>
}

export async function getTypeScriptDefinitions(
	projectRoot: string,
	inputFiles: string[]
) : Promise<Ret> {
	const tsConfig = readTSConfigFile(
		path.join(projectRoot, "tsconfig", "base.json"),
		projectRoot
	)

	const compilerOptions : TSCompilerOptions = {
		...tsConfig.compilerOptions,
		allowJs: false,
		declaration: true,
		emitDeclarationOnly: true,
		noEmitOnError: true,
		baseUrl: "./"
	}

	// don't resolve any path aliases at this point
	compilerOptions.paths = {}

	//
	// write files into memory, not on disk
	//
	const host = tsCreateCompilerHost(compilerOptions)

	const virtualMemoryFS: Map<string, string> = new Map()

	host.writeFile = (filePath, contents) => {
		if (filePath.startsWith(projectRoot + "/")) {
			filePath = filePath.slice(projectRoot.length + 1)
		}

		virtualMemoryFS.set(filePath, contents)
	}

	const program = tsCreateProgram(
		inputFiles, compilerOptions, host
	)

	const {emitSkipped, diagnosticMessages} = emit(program)

	return {
		emitSkipped,
		diagnosticMessages,
		virtualMemoryFS
	}
}
