// extracted from https://github.com/andrewplummer/Sugar/blob/2.0.4/lib/string.js#L168
module.exports = function stringCamelize(str, upper) {
	str = stringUnderscore(str);
	return str.replace(CAMELIZE_REG, function(match, pre, word, index) {
		var cap = upper !== false || index > 0,
			acronym;
		acronym = getAcronym(word);
		// istanbul ignore if
		if (acronym && cap) {
			return acronym;
		}
		return cap ? stringCapitalize(word, true) : word;
	});
};
