// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/
var gen_data = {};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generator function
function generate_text(type_of_list_to_generate) {
	var list_to_generate;
	if (list_to_generate = gen_data[type_of_list_to_generate]) {
		var string;
		if (string = select_from(list_to_generate)) {
			return expand_tokens(string);
		}
	}
	return '';
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generate multiple
function generate_list(type_of_list_to_generate, number_to_generate) {
	var list = [];
	var i;
	for (i = 0; i < number_to_generate; i++) {
		list.push(generate_text(type_of_list_to_generate));
	}
	return list;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// select from list
function select_from(list) {
	if (list.constructor == Array) {
		return select_from_array(list);
	} else {
		return select_from_table(list);
	}
}

function select_from_array(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function select_from_table(list) {
	var len;
	if (len = scale_table(list)) {
		var idx = Math.floor(Math.random() * len) + 1;
		var key;
		for (key in list) {
			var range = key_range(key);
			if (idx >= range[0] && idx <= range[1]) {
				return list[key];
			}
		}
	}
	return '';
}

function scale_table(list) {
	var len = 0;
	var key;
	for (key in list) {
		var r = key_range(key);
		if (r[1] > len) {
			len = r[1];
		}
	}
	return len;
}

function key_range(key) {
	var match;
	if (match = /(\d+)-00/.exec(key)) {
		return [parseInt(match[1]), 100];
	} else if (match = /(\d+)-(\d+)/.exec(key)) {
		return [parseInt(match[1]), parseInt(match[2])];
	} else if (key == '00') {
		return [100, 100];
	} else {
		return [parseInt(key), parseInt(key)];
	}
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generate an output of the table passed in type_of_table_to_output
function generate_table(type_of_table_to_output) {
	var table_to_output;
	if (table_to_output = gen_data[type_of_table_to_output]) {
		// Create the Table Header
		if (table_to_output.constructor == Array) {
			// Ouput Array
		} else {
			// Output List
		}
	} else {
		// Output Empty Table
	}
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// expand {token} in string
function expand_tokens(string) {
	var match;
	while (match = /{(\w+)}/.exec(string)) {
		var token = match[1];
		var repl;
		if (repl = generate_text(token)) {
			string = string.replace('{' + token + '}', repl);
		} else if (repl == "") {
			// Allow for blank entries
			string = string.replace('{' + token + '}', repl);
		} else {
			string = string.replace('{' + token + '}', token);
		}
	}
	return string;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function new_trace() {
	return {
		exclude: {},
		"var": {}
	}
}

function local_trace(a) {
	var c = Object.clone(a);
	c["var"] = Object.clone(a["var"]);
	return c
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function expand_token(string, local_variable_store) {
	var match_1,
		d;
	if (match_1 = /^\d*d\d+/.exec(string))
	/* #D# */
		return roll_dice(match_1[1]);
	else if (match_1 = /^calc (.+)/.exec(string))
	/* calc xxx */
		return roll_dice(match_1[1]);
	else if (match_1 = /^(\d+) x (.+)/.exec(string))
	/* # x # */
		return expand_x(match_1[1], match_1[2], local_variable_store);
	else if (match_1 = /^\[ (.+) \]/.exec(string)) {
		/* [ xxx xxx xxx ] */
		d = match_1[1].split(/,\s*/);
		return expand_tokens(select_from_array(d), local_variable_store)
	} else if (d = gen_data[string]) return expand_tokens(select_from(d), local_variable_store);
	else if (match_1 = /^alt (.+) def (.+)/.exec(string))
	/* alt xxx def xxx */
		return (d = gen_data[match_1[1]]) ? expand_tokens(select_from(d), local_variable_store) : (d = gen_data[match_1[2]]) ? expand_tokens(select_from(d), local_variable_store) : match_1[2];
	else if (match_1 = /^unique (.+)/.exec(string))
	/* unique xxx*/
		return expand_unique(match_1[1], local_variable_store);
	else if (match_1 = /^local (.+)/.exec(string)) {
		/*local xxx */
		string = local_trace(local_variable_store);
		return expand_token(match_1[1], string)
	} else if (match_1 = /^new (.+)/.exec(string)) {
		/* new xxx */
		string = new_trace();
		return expand_token(match_1[1], string)
	} else if (match_1 = /^set (\w+) = (.+?) in (.+)/.exec(string)) {
		/* set xxx01 = xxx02 in xxx03 */
		local_variable_store["var"][match_1[1]] = match_1[2];
		return expand_token(match_1[3], local_variable_store)
	} else if (match_1 = /^set (\w+) = (.+)/.exec(string))
	/* set xxx01 = xxx02 */
		return set_var(match_1[1], match_1[2], local_variable_store);
	else if (match_1 = /^get (\w+) def (.+)/.exec(string))
	/* get xxx01 def xxx02 */
		return local_variable_store["var"][match_1[1]] || match_1[2];
	else if (match_1 = /^get (\w+) fix (.+)/.exec(string))
	/*get xxx01 fix xxx02 */
		return local_variable_store["var"][match_1[1]] || set_var(match_1[1], match_1[2], local_variable_store);
	else if (match_1 = /^get (\w+)/.exec(string))
	/* get xxx01 */
		return local_variable_store["var"][match_1[1]];
	else if (match_1 = /^shift (\w+) = (.+)/.exec(string)) {
		/* shift xxx01 = xxx02 */
		local_variable_store["var"][match_1[1]] = match_1[2].split(/,\s*/);
		return local_variable_store["var"][match_1[1]].shift()
	} else if (match_1 = /^shift (\w+)/.exec(string))
	/* shift xxx01 */
		return local_variable_store["var"][match_1[1]].shift();
	else if (match_1 = /^an (.+)/.exec(string))
	/* an xxx01 */
	/* A or An */
		return aoran(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^An (.+)/.exec(string))
	/* an xxx01 */
	/* A or An with the first letter capitalized */
		return ucfirst(aoran(expand_token(match_1[1], local_variable_store)));
	else if (match_1 = /^nt (.+)/.exec(string))
	/* nt xxx01 */
	/* No The */
		return nothe(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^lc (.+)/.exec(string))
	/* lc xxx01 */
	/* Lower Case */
		return lc(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^lf (.+)/.exec(string))
	/* lf xxx01 */
	/* Add a LineFeed */
		return inline_case(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^lt (.+)/.exec(string))
	/* lt xxx01 */
		return lthe(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^uc (.+)/.exec(string))
	/* uc xxx01 */
	/* upper case */
		return uc(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^uf (.+)/.exec(string))
	/* uf xxx01 */
	/* Upper Case the First Word */
		return ucfirst(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^sc (.+)/.exec(string))
	/* sc xxx01 */
	/* Upper Case the First Word and Lower Case the rest */
		return ucfirst(lc(expand_token(match_1[1], local_variable_store)));
	else if (match_1 = /^tc (.+)/.exec(string))
	/* tc xxx01 */
	/* Title Case everything */
		return title_case(expand_token(match_1[1], local_variable_store));
	else if (match_1 = /^gen_name (.+)/.exec(string)) {
		/* ^gen_name */
		match_1 = match_1[1].replace(/,.*/, "");
		return generate_name(match_1)
	}
	return string
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dice.js
//  TODO: fix and make generic
const fn = /([a-z]*)\(([^()]*?)\)/;
const dice = /(\d*)d(\d+)/;
const incr = /([+-]?\d+\.\d+|[+-]?\d+)(\+\+|--)/;
const mult = /([+-]?\d+\.\d+|[+-]?\d+)\s*(\*|\/|%)\s*([+-]?\d+\.\d+|[+-]?\d+)/;
const add = /([+-]?\d+\.\d+|[+-]?\d+)\s*(\+|-)\s*([+-]?\d+\.\d+|[+-]?\d+)/;
const fp = /(\d+\.\d\d\d+)/;
const max_dice = 1E3;

function roll_dice(input_dice) {
	for (var a; a = fn.exec(input_dice);) {
		a = roll_dice_function(a[1], a[2]);
		input_dice = input_dice.replace(fn, a)
	}
	for (; a = dice.exec(input_dice);) {
		a = roll_dice_dice(a[1], a[2]);
		input_dice = input_dice.replace(dice, a)
	}
	for (; a = incr.exec(input_dice);) {
		a = roll_dice_math(a[1], a[2]);
		input_dice = input_dice.replace(incr, a)
	}
	for (; a = mult.exec(input_dice);) {
		a = roll_dice_math(a[1], a[2], a[3]);
		input_dice = input_dice.replace(mult, a)
	}
	for (; a = add.exec(input_dice);) {
		a = roll_dice_math(a[1], a[2], a[3]);
		input_dice = input_dice.replace(add, a)
	}
	for (; a = fp.exec(input_dice);) {
		a = Math.floor(a[1] * 100 + 0.5) / 100;
		input_dice = input_dice.replace(fp, a)
	}
	return input_dice
}

function roll_dice_function(function_to_perform, number) {
	number = roll_dice(number);
	if (function_to_perform == "int") {
		return Math.floor(number);
	} else if (function_to_perform == "round") {
		return Math.floor(number + 0.5);
	} else if (function_to_perform == "sqrt") {
		return Math.sqrt(number);
	}
	return number
}

function roll_dice_dice(dice_to_roll, sides_on_the_dice) {
	dice_to_roll = parseInt(dice_to_roll);
	if (isNaN(dice_to_roll) || dice_to_roll < 1) {
		dice_to_roll = 1;
	}
	sides_on_the_dice = parseInt(sides_on_the_dice);
	if (isNaN(sides_on_the_dice) || sides_on_the_dice < 0) {
		return 0;
	}
	if (dice_to_roll > max_dice) {
		return 0;
	}
	var final_dice_roll = 0,
		die;
	for (die = 0; die < dice_to_roll; die++) {
		final_dice_roll += roll_1D(sides_on_the_dice) + 1;
	}
	return final_dice_roll
}

function roll_1D(b) {
	return Math.floor(Math.random() * 0.9999 * b)
}

function roll_dice_math(number_on_left, operation_to_perform, number_on_right) {
	number_on_left = parseFloat(number_on_left);
	if (isNaN(number_on_left)) number_on_left = 0;
	number_on_right = parseFloat(number_on_right);
	if (isNaN(number_on_right)) number_on_right = 0;
	if (operation_to_perform == "++") return ++number_on_left;
	if (operation_to_perform == "--") return --number_on_left;
	if (operation_to_perform == "*") return number_on_left * number_on_right;
	if (operation_to_perform == "/") return number_on_left / number_on_right;
	if (operation_to_perform == "%") return number_on_left % number_on_right;
	if (operation_to_perform == "+") return number_on_left + number_on_right;
	if (operation_to_perform == "-") return number_on_left - number_on_right;
	return 0
};
