"use strict";
// Node deps
const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");
const glob = require("glob");
const camelize = require("sugar/string/camelize");

// React deps
const React = require("react");
const { useState } = React;
const PropTypes = require("prop-types");

// Ink deps
const { Text, Color, Static, Box } = require("ink");
const Gradient = require("ink-gradient");
const BigText = require("ink-big-text");
const SelectInput = require("ink-select-input").default;
const MultiSelect = require("ink-multi-select").default;
const InkBox = require("ink-box");
const TextInput = require("ink-text-input").UncontrolledTextInput;

const Spinner = require("ink-spinner").default;

// --------------------------------------------------
// Select Random Spinner Key for each invocation
const cliSpinners = require("cli-spinners");
const cliSpinnerKeys = Object.keys(cliSpinners);
const currentSpinner =
	cliSpinnerKeys[Math.floor(Math.random() * cliSpinnerKeys.length)];
// --------------------------------------------------

mustache.templateCache = undefined;

/*

- plugin name
- plugin namespace (usually company name)
- plugin path

eventual options:
- include OBS?
- interactive component scaffolding based

*/

const availableOptionsMap = {
	obs: "OBS",
	spotify: "Spotify"
};

const availableOptions = Object.keys(availableOptionsMap).map(optionKey => {
	return {
		label: availableOptionsMap[optionKey],
		value: optionKey
	};
});

const App = ({ name }) => {
	const [finished, setFinished] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [projectNameSelected, setProjectNameSelected] = useState(false);
	const [projectNamespace, setProjectNamespace] = useState("");
	const [projectNamespaceSelected, setProjectNamespaceSelected] = useState(
		false
	);
	const [projectPath, setProjectPath] = useState("");
	const [projectPathSelected, setProjectPathSelected] = useState(false);

	const [extraFeatures, setExtraFeatures] = useState([]);
	const [extraFeaturesSelected, setExtraFeaturesSelected] = useState(false);

	const defaultProjectName = "my-streamdeck-plugin";
	const defaultProjectNamespace = "acme";
	const defaultProjectPath = `./${projectName}`;
	return (
		<>
			<Static>
				<Gradient name="morning">
					<BigText
						align="center"
						text="create-|streamdeck-|plugin"
						font="block"
					/>
				</Gradient>
				<InkBox
					borderStyle="round"
					borderColor="cyan"
					float="center"
					padding={1}
				>
					Use:
					<Color color="magenta">"create-streamdeck-plugin --help"</Color> for
					instructions.
				</InkBox>
			</Static>

			{!projectNameSelected && (
				<Box>
					<Box marginRight={1}>Project Name:</Box>
					<TextInput
						placeholder={defaultProjectName}
						value={projectName + ""}
						onSubmit={name => {
							setProjectName(name || defaultProjectName);
							setProjectNameSelected(true);
						}}
					/>
				</Box>
			)}

			{projectNameSelected && (
				<Box>
					<Box marginRight={1}>Project Name:</Box>
					<Text>
						<Color green>{projectName}</Color>
					</Text>
				</Box>
			)}

			{projectNameSelected && !projectPathSelected && (
				<Box>
					<Box marginRight={1}>Project Path:</Box>
					<TextInput
						placeholder={defaultProjectPath}
						value={projectPath}
						onSubmit={path => {
							setProjectPath(path || defaultProjectPath);
							setProjectPathSelected(true);
						}}
					/>
				</Box>
			)}
			{projectPathSelected && (
				<Box>
					<Box marginRight={1}>Project Path:</Box>
					<Text>
						<Color green>{projectPath}</Color>
					</Text>
				</Box>
			)}

			{projectNameSelected && projectPathSelected && !projectNamespaceSelected && (
				<Box>
					<Box marginRight={1}>Project Namespace:</Box>
					<TextInput
						placeholder={defaultProjectNamespace}
						value={projectNamespace}
						onSubmit={namespace => {
							setProjectNamespace(namespace || defaultProjectNamespace);
							setProjectNamespaceSelected(true);
						}}
					/>
				</Box>
			)}

			{projectNamespaceSelected && (
				<Box>
					<Box marginRight={1}>Project Namespace:</Box>
					<Text>
						<Color green>{projectNamespace}</Color>
					</Text>
				</Box>
			)}

			{projectNamespaceSelected && !extraFeaturesSelected && (
				<>
					<MultiSelect
						items={availableOptions}
						onSubmit={result => {
							setExtraFeaturesSelected(true);

							const newExtraFeaturesMap = {};
							result.map(feature => {
								newExtraFeaturesMap[feature.value] = true;
							});

							startScaffoldingFileStructure({
								projectNamespace: projectNamespace || defaultProjectNamespace,
								projectName,
								camelizedProjectName: camelize(projectName),
								projectPath,
								extraFeatures: newExtraFeaturesMap
							});
							setTimeout(() => {
								setFinished(true);
							}, 3000);
						}}
					/>
				</>
			)}

			{extraFeaturesSelected && (
				<Box>
					<Box marginRight={1}>Extra Features:</Box>
					<Text>
						<Color green>{extraFeatures.join(", ")}</Color>
					</Text>
				</Box>
			)}

			{extraFeaturesSelected && !finished && (
				<>
					<Box justifyContent="flex-start">
						<Box margin={2}>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
						</Box>
						<Box marginTop={2} marginBottom={2}>
							<Text>Scaffolding Project</Text>
						</Box>
						<Box margin={2}>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
							<Color green>
								<Spinner type={currentSpinner} />
							</Color>
						</Box>
					</Box>
				</>
			)}

			{finished && (
				<>
					<Text>All done. :)</Text>
				</>
			)}
		</>
	);
};

App.propTypes = {
	name: PropTypes.string
};

App.defaultProps = {
	name: "Stranger"
};

module.exports = App;

async function startScaffoldingFileStructure(inputResults) {
	// coerce projectPath
	const projectPath = path.resolve(inputResults.projectPath);

	// get plugin path
	const templatePath = path.resolve(__dirname, `templates/base/example`);

	// read files from plugin path
	return Promise.all(
		glob.sync(`${templatePath}/**/*`, { nodir: true }).map(async filePath => {
			const relativeFilePath = filePath.slice(templatePath.length);
			const newFilePath = `${projectPath}${relativeFilePath}`;
			await fs.ensureFile(newFilePath);

			if (
				![
					".gif",
					".jpg",
					".jpeg",
					".bmp",
					".png",
					".eot",
					".ttf",
					".woff",
					".woff2",
					".wav",
					".pdf"
				].includes(path.extname(filePath))
			) {
				const interpolatedFileContents = mustache.render(
					await fs.readFile(filePath, { encoding: "utf-8" }),
					inputResults,
					{},
					["<%%", "%%>"]
				);
				await fs.writeFile(newFilePath, interpolatedFileContents);
			} else {
				const fileContents = await fs.readFile(filePath);
				await fs.writeFile(newFilePath, fileContents);
			}
		})
	);
}
