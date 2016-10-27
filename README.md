# randomtables
A random table roller based on the work started by http://donjon.bin.sh/code/random/

## Source Code

The following source code provides a simple yet flexible JavaScript random text generator, and some example data. Both are released to the public domain.

*   `generator.js`
*   `warrior_data.js`

## Using the Generator

First, you'll need to create a JavaScript data file. This file defines tables as named elements of the `gen_data` object (which is declared in `generator.js`). Typically, the first or main table in the file contains text patterns, which may include phrases or words from other tables indicated by `{name}`. Note that table names can only contain the letters a-z, digits 0-9, and the underscore. A table may be defined as a simple array list, or as a indexed object (see the `warrior_data.js` file for examples of both).

Then, include both the `generator.js` file and your data file in your HTML page. A clever person might note that you could easily create and include more than one data file here.


~~~~
<script type="text/javascript" src="generator.js"></script>
<script type="text/javascript" src="warrior_data.js"></script>
~~~~


The `generate_text()` function accepts a single argument, the name of your main table, and returns a text string. You can simply write this text string to the HTML page...

~~~~
<script type="text/javascript">
  document.write(generate_text('warrior'));
</script>
~~~~

Or assign it to a variable in your own JavaScript code. You may also be interested in the `generate_list()` function, which accepts the name of a table and a number, and returns an array of generated text strings.
